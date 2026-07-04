# FoodOS Business Objects Entity Bible v1.0

Status: Product development source of truth  
Scope: Version 1 MVP plus explicit future placeholders  
Architecture style: Domain Driven, multi-tenant, integration-first, AI-native

This document defines the business objects that should drive the first implementation of FoodOS. It is intended to be the source of truth for Prisma schema design, PostgreSQL tables, NestJS modules, REST APIs, React forms, event contracts, permissions, and AI context.

## 1. Modeling Rules

### 1.1 Domain ownership

Every entity has one owning domain. Other domains can reference it by ID but should not own its lifecycle.

| Domain | Owns |
| --- | --- |
| Identity | User, Role, Permission, Membership |
| Restaurant | Organization, Restaurant, Branch, Department, Table, Settings |
| Menu | Menu, Category, Item, Modifier, Combo, Pricing, Availability |
| Inventory | Ingredient, Stock, Supplier, Purchase, Waste, Recipe |
| Orders | Order, Order Item, Kitchen Ticket, Payment, Invoice |
| CRM | Customer, Customer Address, Wallet, Membership, Review |
| Delivery | Delivery Assignment, Driver, Delivery Event |
| Finance | Expense, Tax, Settlement, Report Snapshot |
| Marketing | Campaign, Coupon, Notification |
| Analytics | KPI Snapshot, Dashboard Metric |
| AI | AI Insight, AI Summary, AI Recommendation |
| Integrations | Provider Config, Webhook, External Reference |

### 1.2 Dependency order

Implementation should follow this dependency chain:

Authentication -> Organizations -> Restaurants -> Branches -> Users -> Roles -> Menus -> Inventory -> Orders -> Kitchen -> Payments -> Delivery -> CRM -> Marketing -> Analytics -> AI

Rules:

- A lower-level domain must not depend directly on a later domain.
- Later domains can reference earlier domains by ID.
- Cross-domain side effects should use events, not direct calls where practical.
- Integration adapters must implement provider interfaces. Business logic must not depend on vendor-specific classes.

### 1.3 Global fields

Unless explicitly excluded, every persisted entity should include:

| Field | Type | Rule |
| --- | --- | --- |
| id | UUID or ULID | Primary identifier, never reused |
| organizationId | UUID | Required for tenant-owned objects |
| createdAt | DateTime | Server generated |
| updatedAt | DateTime | Server generated |
| deletedAt | DateTime nullable | Soft delete where deletion is allowed |
| createdByUserId | UUID nullable | Required for back-office actions when available |
| updatedByUserId | UUID nullable | Required for back-office actions when available |
| version | Int | Optimistic concurrency for offline sync and conflict detection |

Exceptions:

- Public immutable event records may not use `updatedAt`.
- Global system catalogs may not have `organizationId`.
- Authentication provider records may be owned by Better Auth and mapped into FoodOS through `User`.

### 1.4 Tenant and branch scoping

| Scope | Meaning |
| --- | --- |
| Organization scoped | Shared across all restaurants and branches under a tenant |
| Restaurant scoped | Shared across branches of one restaurant brand |
| Branch scoped | Operational object for a physical or virtual branch |
| User scoped | Personal state or preferences |

Rules:

- All operational reads must be scoped by `organizationId`.
- Branch-level users should not access another branch unless their role grants it.
- Menu, inventory, orders, kitchen, POS, and delivery are branch-sensitive even when configured at restaurant level.

### 1.5 Money, tax, and time

- Store money in minor units: `amountMinor: Int`.
- Store currency as ISO code: `currency: String`, default `INR` for India deployments.
- Tax fields should support GST now and future tax regimes later.
- Store all timestamps in UTC.
- Store branch timezone on `Branch`.
- Business-day reporting should use branch timezone and configurable service day cutover.

### 1.6 Events

Each meaningful lifecycle change should emit a domain event. Events should be written to an outbox table in the same database transaction as the state change.

Event naming convention:

`domain.entity.past_tense_action.v1`

Examples:

- `restaurant.branch.created.v1`
- `menu.item.price_changed.v1`
- `orders.order.confirmed.v1`
- `inventory.stock.low_detected.v1`

### 1.7 Permissions

Permission naming convention:

`domain.resource.action`

Examples:

- `restaurant.branch.create`
- `menu.item.update`
- `orders.order.refund`
- `inventory.stock.adjust`

Actions:

- `read`
- `create`
- `update`
- `delete`
- `approve`
- `assign`
- `void`
- `refund`
- `export`
- `manage`

### 1.8 API ownership

Each entity card declares the owning API module. Modules should expose clear application services. Database access should stay inside the owning module unless a read model is intentionally created.

Recommended NestJS module shape:

- `domain.module.ts`
- `application/*.service.ts`
- `domain/entities`
- `domain/events`
- `infrastructure/prisma`
- `presentation/http`
- `presentation/websocket` where needed

## 2. Identity Domain

### 2.1 User

Purpose: Represents a human account that can authenticate and act inside one or more organizations.

Fields:

- `id`
- `email`
- `phone`
- `fullName`
- `displayName`
- `avatarUrl`
- `authProviderUserId`
- `status`: `INVITED`, `ACTIVE`, `SUSPENDED`, `DEACTIVATED`
- `lastLoginAt`
- `preferredLocale`
- `metadata`

Validation:

- At least one of `email` or `phone` is required.
- `email` must be unique when present.
- `phone` must be unique per country code when present.
- `status` controls access; suspended and deactivated users cannot create sessions.

Relationships:

- Has many `Membership`.
- May be linked to `Employee`.
- Creates and updates many operational records.

State transitions:

- `INVITED -> ACTIVE`
- `ACTIVE -> SUSPENDED`
- `SUSPENDED -> ACTIVE`
- `ACTIVE -> DEACTIVATED`

Events emitted:

- `identity.user.invited.v1`
- `identity.user.activated.v1`
- `identity.user.suspended.v1`
- `identity.user.deactivated.v1`

Permissions:

- Self profile read/update.
- Organization admins can invite, suspend, and deactivate users.

API ownership: `IdentityModule`

### 2.2 Membership

Purpose: Connects a user to an organization, restaurant, or branch with one or more roles.

Fields:

- `id`
- `organizationId`
- `userId`
- `restaurantId`
- `branchId`
- `scope`: `ORGANIZATION`, `RESTAURANT`, `BRANCH`
- `status`: `INVITED`, `ACTIVE`, `SUSPENDED`, `REMOVED`
- `invitedByUserId`
- `invitedAt`
- `acceptedAt`

Validation:

- `organizationId` and `userId` are required.
- `restaurantId` is required for restaurant scope.
- `branchId` is required for branch scope.
- A user cannot have duplicate active memberships for the same scope.

Relationships:

- Belongs to `User`.
- Belongs to `Organization`.
- Optionally belongs to `Restaurant` and `Branch`.
- Has many role assignments.

State transitions:

- `INVITED -> ACTIVE`
- `ACTIVE -> SUSPENDED`
- `SUSPENDED -> ACTIVE`
- `ACTIVE -> REMOVED`

Events emitted:

- `identity.membership.invited.v1`
- `identity.membership.accepted.v1`
- `identity.membership.suspended.v1`
- `identity.membership.removed.v1`

Permissions:

- `identity.membership.read`
- `identity.membership.invite`
- `identity.membership.update`
- `identity.membership.remove`

API ownership: `IdentityModule`

### 2.3 Role

Purpose: Defines a named bundle of permissions for a tenant.

Fields:

- `id`
- `organizationId`
- `name`
- `description`
- `isSystemRole`
- `isDefault`
- `status`: `ACTIVE`, `ARCHIVED`

Validation:

- `name` is unique per organization.
- System roles cannot be deleted.
- A role cannot be archived while assigned to active memberships unless reassigned.

Relationships:

- Has many `RolePermission`.
- Has many `MembershipRole`.

State transitions:

- `ACTIVE -> ARCHIVED`
- `ARCHIVED -> ACTIVE`

Events emitted:

- `identity.role.created.v1`
- `identity.role.updated.v1`
- `identity.role.archived.v1`

Permissions:

- `identity.role.read`
- `identity.role.create`
- `identity.role.update`
- `identity.role.delete`
- `identity.role.manage`

API ownership: `IdentityModule`

### 2.4 Permission

Purpose: Canonical permission key used by RBAC checks.

Fields:

- `id`
- `key`
- `domain`
- `resource`
- `action`
- `description`
- `isSystemPermission`

Validation:

- `key` is globally unique.
- Application code should treat permissions as seeded immutable records.

Relationships:

- Has many `RolePermission`.

State transitions:

- Usually immutable after seed.

Events emitted:

- None during normal product use.

Permissions:

- Readable by organization admins.
- Managed only by system operators or migrations.

API ownership: `IdentityModule`

## 3. Restaurant Domain

### 3.1 Organization

Purpose: Top-level tenant that owns restaurants, billing, users, roles, and integration configuration.

Fields:

- `id`
- `legalName`
- `tradeName`
- `slug`
- `countryCode`
- `defaultCurrency`
- `defaultTimezone`
- `status`: `TRIAL`, `ACTIVE`, `PAST_DUE`, `SUSPENDED`, `CLOSED`
- `planCode`
- `billingEmail`
- `metadata`

Validation:

- `slug` is globally unique.
- `defaultCurrency` must be supported.
- Organization cannot be closed with active branches unless explicitly confirmed.

Relationships:

- Has many `Restaurant`.
- Has many `Branch`.
- Has many `Membership`.
- Has many provider configurations.

State transitions:

- `TRIAL -> ACTIVE`
- `ACTIVE -> PAST_DUE`
- `PAST_DUE -> ACTIVE`
- `ACTIVE -> SUSPENDED`
- `SUSPENDED -> ACTIVE`
- `ACTIVE -> CLOSED`

Events emitted:

- `restaurant.organization.created.v1`
- `restaurant.organization.activated.v1`
- `restaurant.organization.suspended.v1`
- `restaurant.organization.closed.v1`

Permissions:

- `restaurant.organization.read`
- `restaurant.organization.update`
- `restaurant.organization.manage`

API ownership: `RestaurantModule`

### 3.2 Restaurant

Purpose: Represents a food brand or operating concept under an organization.

Fields:

- `id`
- `organizationId`
- `name`
- `slug`
- `brandLogoUrl`
- `cuisineTypes`
- `description`
- `status`: `DRAFT`, `ACTIVE`, `PAUSED`, `ARCHIVED`
- `primaryContactName`
- `primaryContactPhone`
- `primaryContactEmail`

Validation:

- `name` is required.
- `slug` is unique within organization.
- Active restaurant must have at least one active branch before accepting orders.

Relationships:

- Belongs to `Organization`.
- Has many `Branch`.
- Has menus, menu items, customers, and reports.

State transitions:

- `DRAFT -> ACTIVE`
- `ACTIVE -> PAUSED`
- `PAUSED -> ACTIVE`
- `ACTIVE -> ARCHIVED`

Events emitted:

- `restaurant.restaurant.created.v1`
- `restaurant.restaurant.activated.v1`
- `restaurant.restaurant.paused.v1`
- `restaurant.restaurant.archived.v1`

Permissions:

- `restaurant.restaurant.read`
- `restaurant.restaurant.create`
- `restaurant.restaurant.update`
- `restaurant.restaurant.delete`

API ownership: `RestaurantModule`

### 3.3 Branch

Purpose: Represents a physical, cloud kitchen, or virtual operating location.

Fields:

- `id`
- `organizationId`
- `restaurantId`
- `name`
- `branchCode`
- `branchType`: `DINE_IN`, `CLOUD_KITCHEN`, `TAKEAWAY`, `CATERING`, `HYBRID`
- `status`: `SETUP`, `ACTIVE`, `TEMPORARILY_CLOSED`, `PERMANENTLY_CLOSED`
- `phone`
- `email`
- `addressLine1`
- `addressLine2`
- `city`
- `state`
- `postalCode`
- `countryCode`
- `latitude`
- `longitude`
- `timezone`
- `serviceDayCutoverMinutes`

Validation:

- `branchCode` is unique per restaurant.
- Active branch requires address, timezone, contact phone, and operating hours.
- Latitude and longitude must be valid when present.

Relationships:

- Belongs to `Restaurant`.
- Has departments, tables, employees, inventory, orders, kitchen tickets, POS shifts.

State transitions:

- `SETUP -> ACTIVE`
- `ACTIVE -> TEMPORARILY_CLOSED`
- `TEMPORARILY_CLOSED -> ACTIVE`
- `ACTIVE -> PERMANENTLY_CLOSED`

Events emitted:

- `restaurant.branch.created.v1`
- `restaurant.branch.activated.v1`
- `restaurant.branch.closed_temporarily.v1`
- `restaurant.branch.closed_permanently.v1`

Permissions:

- `restaurant.branch.read`
- `restaurant.branch.create`
- `restaurant.branch.update`
- `restaurant.branch.delete`
- `restaurant.branch.manage`

API ownership: `RestaurantModule`

### 3.4 Department

Purpose: Groups employees and operational work areas inside a branch.

Fields:

- `id`
- `organizationId`
- `branchId`
- `name`
- `departmentType`: `KITCHEN`, `SERVICE`, `CASHIER`, `DELIVERY`, `MANAGEMENT`, `OTHER`
- `status`: `ACTIVE`, `INACTIVE`

Validation:

- `name` is unique per branch.
- Department cannot be deactivated while active tasks or tickets are assigned.

Relationships:

- Belongs to `Branch`.
- Has employees and kitchen stations.

State transitions:

- `ACTIVE -> INACTIVE`
- `INACTIVE -> ACTIVE`

Events emitted:

- `restaurant.department.created.v1`
- `restaurant.department.updated.v1`
- `restaurant.department.deactivated.v1`

Permissions:

- `restaurant.department.read`
- `restaurant.department.create`
- `restaurant.department.update`
- `restaurant.department.delete`

API ownership: `RestaurantModule`

### 3.5 DiningTable

Purpose: Represents a dine-in table or seating area for order assignment and service tracking.

Fields:

- `id`
- `organizationId`
- `branchId`
- `label`
- `section`
- `capacity`
- `qrCode`
- `status`: `AVAILABLE`, `OCCUPIED`, `RESERVED`, `BLOCKED`, `INACTIVE`

Validation:

- `label` is unique per branch.
- `capacity` must be greater than zero.
- Table cannot be deleted if referenced by open orders.

Relationships:

- Belongs to `Branch`.
- Has many dine-in `Order`.

State transitions:

- `AVAILABLE -> OCCUPIED`
- `OCCUPIED -> AVAILABLE`
- `AVAILABLE -> RESERVED`
- `RESERVED -> OCCUPIED`
- `AVAILABLE -> BLOCKED`
- `BLOCKED -> AVAILABLE`
- Any non-open state -> `INACTIVE`

Events emitted:

- `restaurant.table.created.v1`
- `restaurant.table.status_changed.v1`

Permissions:

- `restaurant.table.read`
- `restaurant.table.create`
- `restaurant.table.update`
- `restaurant.table.delete`
- `restaurant.table.manage`

API ownership: `RestaurantModule`

### 3.6 BranchSettings

Purpose: Stores configurable operational behavior for a branch.

Fields:

- `id`
- `organizationId`
- `branchId`
- `acceptsDineIn`
- `acceptsTakeaway`
- `acceptsDelivery`
- `autoAcceptOrders`
- `printKitchenTickets`
- `taxInclusivePricing`
- `defaultPreparationMinutes`
- `lowStockThresholdMode`: `GLOBAL`, `PER_ITEM`
- `settingsJson`

Validation:

- Exactly one settings record per branch.
- Boolean channel flags must match enabled modules.

Relationships:

- Belongs to `Branch`.

State transitions:

- No lifecycle state; updates are audited.

Events emitted:

- `restaurant.branch_settings.updated.v1`

Permissions:

- `restaurant.settings.read`
- `restaurant.settings.update`
- `restaurant.settings.manage`

API ownership: `RestaurantModule`

## 4. Staff Domain

### 4.1 Employee

Purpose: Represents a staff member working for a restaurant or branch. May or may not have a login user.

Fields:

- `id`
- `organizationId`
- `restaurantId`
- `branchId`
- `userId`
- `employeeCode`
- `fullName`
- `phone`
- `email`
- `jobTitle`
- `employmentType`: `FULL_TIME`, `PART_TIME`, `CONTRACT`, `TEMPORARY`
- `status`: `ACTIVE`, `ON_LEAVE`, `SUSPENDED`, `EXITED`
- `joinedAt`
- `exitedAt`

Validation:

- `employeeCode` is unique per organization.
- Active employees require name, phone, branch, and job title.
- `exitedAt` is required when status is `EXITED`.

Relationships:

- Optionally belongs to `User`.
- Belongs to `Branch`.
- Can be assigned to orders, kitchen tickets, delivery tasks, POS shifts.

State transitions:

- `ACTIVE -> ON_LEAVE`
- `ON_LEAVE -> ACTIVE`
- `ACTIVE -> SUSPENDED`
- `SUSPENDED -> ACTIVE`
- `ACTIVE -> EXITED`

Events emitted:

- `staff.employee.created.v1`
- `staff.employee.updated.v1`
- `staff.employee.exited.v1`

Permissions:

- `staff.employee.read`
- `staff.employee.create`
- `staff.employee.update`
- `staff.employee.delete`

API ownership: `StaffModule`

## 5. Menu Domain

### 5.1 Menu

Purpose: A sellable menu configuration for a restaurant or branch.

Fields:

- `id`
- `organizationId`
- `restaurantId`
- `branchId`
- `name`
- `menuType`: `DINE_IN`, `TAKEAWAY`, `DELIVERY`, `CATERING`, `ALL_DAY`, `CUSTOM`
- `status`: `DRAFT`, `ACTIVE`, `SCHEDULED`, `ARCHIVED`
- `startsAt`
- `endsAt`
- `sortOrder`

Validation:

- `name` is required.
- Active menus cannot have overlapping schedules for the same channel unless explicitly allowed.
- Branch-specific menu overrides restaurant-level menu.

Relationships:

- Belongs to `Restaurant`.
- Optionally belongs to `Branch`.
- Has many `MenuCategory`.
- Contains many `MenuItem` through category placement.

State transitions:

- `DRAFT -> ACTIVE`
- `DRAFT -> SCHEDULED`
- `SCHEDULED -> ACTIVE`
- `ACTIVE -> ARCHIVED`

Events emitted:

- `menu.menu.created.v1`
- `menu.menu.activated.v1`
- `menu.menu.archived.v1`

Permissions:

- `menu.menu.read`
- `menu.menu.create`
- `menu.menu.update`
- `menu.menu.delete`
- `menu.menu.publish`

API ownership: `MenuModule`

### 5.2 MenuCategory

Purpose: Groups menu items for customer-facing and POS navigation.

Fields:

- `id`
- `organizationId`
- `menuId`
- `name`
- `description`
- `imageUrl`
- `sortOrder`
- `status`: `ACTIVE`, `HIDDEN`, `ARCHIVED`

Validation:

- `name` is unique within a menu.
- Category cannot be archived while it contains active items unless confirmed.

Relationships:

- Belongs to `Menu`.
- Has many category item placements.

State transitions:

- `ACTIVE -> HIDDEN`
- `HIDDEN -> ACTIVE`
- `ACTIVE -> ARCHIVED`

Events emitted:

- `menu.category.created.v1`
- `menu.category.updated.v1`
- `menu.category.archived.v1`

Permissions:

- `menu.category.read`
- `menu.category.create`
- `menu.category.update`
- `menu.category.delete`

API ownership: `MenuModule`

### 5.3 MenuItem

Purpose: Represents a sellable food or beverage item.

Fields:

- `id`
- `organizationId`
- `restaurantId`
- `branchId`
- `sku`
- `name`
- `description`
- `itemType`: `FOOD`, `BEVERAGE`, `PACKAGING`, `SERVICE`, `COMBO`
- `dietaryType`: `VEG`, `NON_VEG`, `EGG`, `VEGAN`, `JAIN`, `OTHER`
- `basePriceMinor`
- `currency`
- `taxCategoryId`
- `imageUrl`
- `preparationMinutes`
- `isRecommended`
- `isStockTracked`
- `status`: `DRAFT`, `ACTIVE`, `UNAVAILABLE`, `ARCHIVED`

Validation:

- `name`, `basePriceMinor`, and `currency` are required.
- Price cannot be negative.
- Active items require category placement and tax category.
- Stock-tracked items require recipe or inventory mapping before publication.

Relationships:

- Belongs to `Restaurant`.
- Optionally belongs to `Branch`.
- Has many categories through placement.
- Has modifier groups.
- Has recipe lines linking to ingredients.
- Appears in order items.

State transitions:

- `DRAFT -> ACTIVE`
- `ACTIVE -> UNAVAILABLE`
- `UNAVAILABLE -> ACTIVE`
- `ACTIVE -> ARCHIVED`

Events emitted:

- `menu.item.created.v1`
- `menu.item.activated.v1`
- `menu.item.price_changed.v1`
- `menu.item.availability_changed.v1`
- `menu.item.archived.v1`

Permissions:

- `menu.item.read`
- `menu.item.create`
- `menu.item.update`
- `menu.item.delete`
- `menu.item.publish`

API ownership: `MenuModule`

### 5.4 MenuItemPlacement

Purpose: Places an item inside a category with sort order and optional channel visibility.

Fields:

- `id`
- `organizationId`
- `menuId`
- `categoryId`
- `menuItemId`
- `sortOrder`
- `visibleChannels`
- `status`: `ACTIVE`, `HIDDEN`

Validation:

- Same item cannot be duplicated inside the same category.
- Placement must reference an item available to the same restaurant or branch scope.

Relationships:

- Belongs to `Menu`, `MenuCategory`, and `MenuItem`.

State transitions:

- `ACTIVE -> HIDDEN`
- `HIDDEN -> ACTIVE`

Events emitted:

- `menu.item_placement.created.v1`
- `menu.item_placement.updated.v1`

Permissions:

- `menu.menu.update`
- `menu.category.update`

API ownership: `MenuModule`

### 5.5 ModifierGroup

Purpose: Defines a selectable group of options for a menu item, such as size, toppings, or spice level.

Fields:

- `id`
- `organizationId`
- `restaurantId`
- `name`
- `selectionType`: `SINGLE`, `MULTIPLE`
- `minSelections`
- `maxSelections`
- `isRequired`
- `sortOrder`
- `status`: `ACTIVE`, `ARCHIVED`

Validation:

- `minSelections` must be zero or greater.
- `maxSelections` must be greater than or equal to `minSelections`.
- Required groups need `minSelections` greater than zero.

Relationships:

- Has many `ModifierOption`.
- Assigned to many `MenuItem`.

State transitions:

- `ACTIVE -> ARCHIVED`

Events emitted:

- `menu.modifier_group.created.v1`
- `menu.modifier_group.updated.v1`
- `menu.modifier_group.archived.v1`

Permissions:

- `menu.modifier.read`
- `menu.modifier.create`
- `menu.modifier.update`
- `menu.modifier.delete`

API ownership: `MenuModule`

### 5.6 ModifierOption

Purpose: A selectable option inside a modifier group.

Fields:

- `id`
- `organizationId`
- `modifierGroupId`
- `name`
- `priceDeltaMinor`
- `currency`
- `isDefault`
- `sortOrder`
- `status`: `ACTIVE`, `UNAVAILABLE`, `ARCHIVED`

Validation:

- `name` is unique inside modifier group.
- `priceDeltaMinor` can be zero or positive.
- Only one default option for single-select groups unless explicitly allowed.

Relationships:

- Belongs to `ModifierGroup`.
- Can be referenced by order item modifiers.

State transitions:

- `ACTIVE -> UNAVAILABLE`
- `UNAVAILABLE -> ACTIVE`
- `ACTIVE -> ARCHIVED`

Events emitted:

- `menu.modifier_option.created.v1`
- `menu.modifier_option.updated.v1`
- `menu.modifier_option.availability_changed.v1`

Permissions:

- `menu.modifier.read`
- `menu.modifier.create`
- `menu.modifier.update`
- `menu.modifier.delete`

API ownership: `MenuModule`

### 5.7 PriceRule

Purpose: Supports branch, channel, time, or customer-specific pricing without duplicating menu items.

Fields:

- `id`
- `organizationId`
- `restaurantId`
- `branchId`
- `menuItemId`
- `channel`: `DINE_IN`, `TAKEAWAY`, `DELIVERY`, `MARKETPLACE`, `ALL`
- `priceMinor`
- `currency`
- `startsAt`
- `endsAt`
- `priority`
- `status`: `ACTIVE`, `INACTIVE`

Validation:

- Price cannot be negative.
- Active rules for the same item and channel must have deterministic priority.
- Date range must be valid when both dates are present.

Relationships:

- Belongs to `MenuItem`.
- Optionally scoped to `Branch`.

State transitions:

- `ACTIVE -> INACTIVE`
- `INACTIVE -> ACTIVE`

Events emitted:

- `menu.price_rule.created.v1`
- `menu.price_rule.updated.v1`
- `menu.price_rule.deactivated.v1`

Permissions:

- `menu.pricing.read`
- `menu.pricing.create`
- `menu.pricing.update`
- `menu.pricing.delete`

API ownership: `MenuModule`

### 5.8 ItemAvailability

Purpose: Captures channel, schedule, and stock-aware availability for sellable items.

Fields:

- `id`
- `organizationId`
- `menuItemId`
- `branchId`
- `channel`
- `dayOfWeek`
- `startTimeLocal`
- `endTimeLocal`
- `manualOverride`: `AVAILABLE`, `UNAVAILABLE`, `NONE`
- `reason`

Validation:

- Time ranges must be valid.
- Manual override requires a reason when setting unavailable.
- Availability resolution must consider branch status, menu status, item status, stock, and schedule.

Relationships:

- Belongs to `MenuItem`.
- Optionally belongs to `Branch`.

State transitions:

- No lifecycle state; availability is computed from fields and related state.

Events emitted:

- `menu.item_availability.updated.v1`

Permissions:

- `menu.availability.read`
- `menu.availability.update`

API ownership: `MenuModule`

## 6. Inventory Domain

### 6.1 Ingredient

Purpose: Represents a raw material or stock-tracked input used to prepare menu items.

Fields:

- `id`
- `organizationId`
- `restaurantId`
- `name`
- `sku`
- `category`
- `unitOfMeasure`
- `purchaseUnitOfMeasure`
- `conversionFactor`
- `preferredSupplierId`
- `lowStockThreshold`
- `parLevel`
- `isPerishable`
- `shelfLifeDays`
- `status`: `ACTIVE`, `INACTIVE`, `ARCHIVED`

Validation:

- `name`, `unitOfMeasure`, and `purchaseUnitOfMeasure` are required.
- `conversionFactor` must be greater than zero.
- Perishable ingredients should have shelf life.
- Threshold and par level cannot be negative.

Relationships:

- Has many stock lots and movements.
- Has many recipe lines.
- Optionally belongs to preferred supplier.

State transitions:

- `ACTIVE -> INACTIVE`
- `INACTIVE -> ACTIVE`
- `INACTIVE -> ARCHIVED`

Events emitted:

- `inventory.ingredient.created.v1`
- `inventory.ingredient.updated.v1`
- `inventory.ingredient.archived.v1`

Permissions:

- `inventory.ingredient.read`
- `inventory.ingredient.create`
- `inventory.ingredient.update`
- `inventory.ingredient.delete`

API ownership: `InventoryModule`

### 6.2 StockLot

Purpose: Represents a quantity of ingredient stock received at a branch with optional expiry.

Fields:

- `id`
- `organizationId`
- `branchId`
- `ingredientId`
- `lotCode`
- `quantityOnHand`
- `unitOfMeasure`
- `unitCostMinor`
- `currency`
- `receivedAt`
- `expiresAt`
- `status`: `AVAILABLE`, `RESERVED`, `DEPLETED`, `EXPIRED`, `WASTED`

Validation:

- Quantity cannot be negative.
- Unit must match ingredient inventory unit after conversion.
- Expiry is required for perishable ingredients when known.

Relationships:

- Belongs to `Branch`.
- Belongs to `Ingredient`.
- Created by purchase receipt, stock adjustment, or opening balance.
- Consumed by order production and waste.

State transitions:

- `AVAILABLE -> RESERVED`
- `AVAILABLE -> DEPLETED`
- `AVAILABLE -> EXPIRED`
- `AVAILABLE -> WASTED`
- `RESERVED -> AVAILABLE`
- `RESERVED -> DEPLETED`

Events emitted:

- `inventory.stock_lot.received.v1`
- `inventory.stock_lot.depleted.v1`
- `inventory.stock_lot.expired.v1`
- `inventory.stock_lot.wasted.v1`

Permissions:

- `inventory.stock.read`
- `inventory.stock.receive`
- `inventory.stock.adjust`
- `inventory.stock.writeoff`

API ownership: `InventoryModule`

### 6.3 StockMovement

Purpose: Immutable ledger entry for every inventory quantity change.

Fields:

- `id`
- `organizationId`
- `branchId`
- `ingredientId`
- `stockLotId`
- `movementType`: `OPENING`, `PURCHASE_RECEIPT`, `ORDER_CONSUMPTION`, `ADJUSTMENT`, `TRANSFER_IN`, `TRANSFER_OUT`, `WASTE`, `EXPIRY`
- `quantityDelta`
- `unitOfMeasure`
- `unitCostMinor`
- `currency`
- `referenceType`
- `referenceId`
- `reason`

Validation:

- Immutable after creation.
- `quantityDelta` cannot be zero.
- Negative movement requires enough available stock unless admin override is enabled.
- Manual adjustment requires reason.

Relationships:

- Belongs to `Ingredient`.
- Optionally belongs to `StockLot`.
- References order, purchase, waste, or transfer.

State transitions:

- Immutable.

Events emitted:

- `inventory.stock_movement.recorded.v1`
- `inventory.stock.low_detected.v1` when threshold is crossed

Permissions:

- `inventory.stock.read`
- `inventory.stock.adjust`
- `inventory.stock.export`

API ownership: `InventoryModule`

### 6.4 Supplier

Purpose: Represents a vendor that supplies ingredients or packaging.

Fields:

- `id`
- `organizationId`
- `name`
- `contactName`
- `phone`
- `email`
- `gstin`
- `address`
- `paymentTermsDays`
- `status`: `ACTIVE`, `INACTIVE`, `BLACKLISTED`

Validation:

- `name` is required and unique per organization.
- GSTIN validation should apply for India where present.
- Blacklisted suppliers cannot receive new purchase orders.

Relationships:

- Has many purchase orders.
- Can be preferred supplier for ingredients.

State transitions:

- `ACTIVE -> INACTIVE`
- `INACTIVE -> ACTIVE`
- `ACTIVE -> BLACKLISTED`
- `BLACKLISTED -> ACTIVE` with approval

Events emitted:

- `inventory.supplier.created.v1`
- `inventory.supplier.updated.v1`
- `inventory.supplier.blacklisted.v1`

Permissions:

- `inventory.supplier.read`
- `inventory.supplier.create`
- `inventory.supplier.update`
- `inventory.supplier.delete`

API ownership: `InventoryModule`

### 6.5 PurchaseOrder

Purpose: Tracks ingredient procurement from supplier to receipt.

Fields:

- `id`
- `organizationId`
- `branchId`
- `supplierId`
- `poNumber`
- `status`: `DRAFT`, `SENT`, `PARTIALLY_RECEIVED`, `RECEIVED`, `CANCELLED`
- `orderedAt`
- `expectedAt`
- `subtotalMinor`
- `taxMinor`
- `totalMinor`
- `currency`
- `notes`

Validation:

- `poNumber` is unique per organization.
- Sent purchase order requires at least one line.
- Received quantities cannot exceed ordered quantities unless over-receipt is allowed.
- Cancelled orders cannot receive stock.

Relationships:

- Belongs to `Supplier` and `Branch`.
- Has many `PurchaseOrderLine`.
- Creates `StockLot` and `StockMovement` on receipt.

State transitions:

- `DRAFT -> SENT`
- `SENT -> PARTIALLY_RECEIVED`
- `PARTIALLY_RECEIVED -> RECEIVED`
- `SENT -> RECEIVED`
- `DRAFT -> CANCELLED`
- `SENT -> CANCELLED`

Events emitted:

- `inventory.purchase_order.created.v1`
- `inventory.purchase_order.sent.v1`
- `inventory.purchase_order.partially_received.v1`
- `inventory.purchase_order.received.v1`
- `inventory.purchase_order.cancelled.v1`

Permissions:

- `inventory.purchase.read`
- `inventory.purchase.create`
- `inventory.purchase.update`
- `inventory.purchase.approve`
- `inventory.purchase.receive`
- `inventory.purchase.cancel`

API ownership: `InventoryModule`

### 6.6 PurchaseOrderLine

Purpose: Line item inside a purchase order.

Fields:

- `id`
- `organizationId`
- `purchaseOrderId`
- `ingredientId`
- `orderedQuantity`
- `receivedQuantity`
- `unitOfMeasure`
- `unitCostMinor`
- `taxMinor`
- `lineTotalMinor`

Validation:

- Ordered quantity must be greater than zero.
- Received quantity cannot be negative.
- Unit cost cannot be negative.

Relationships:

- Belongs to `PurchaseOrder`.
- Belongs to `Ingredient`.

State transitions:

- Follows parent purchase order.

Events emitted:

- Usually emitted through purchase order events.

Permissions:

- Same as `PurchaseOrder`.

API ownership: `InventoryModule`

### 6.7 WasteEntry

Purpose: Records stock waste caused by expiry, spoilage, preparation loss, mistakes, or returns.

Fields:

- `id`
- `organizationId`
- `branchId`
- `ingredientId`
- `stockLotId`
- `quantity`
- `unitOfMeasure`
- `reason`: `EXPIRED`, `SPOILED`, `PREP_LOSS`, `ORDER_MISTAKE`, `DAMAGED`, `OTHER`
- `notes`
- `recordedByEmployeeId`
- `recordedAt`
- `approvedByUserId`
- `status`: `RECORDED`, `APPROVED`, `REJECTED`

Validation:

- Quantity must be greater than zero.
- Reason is required.
- Approval may be required above configured value threshold.

Relationships:

- Belongs to `Branch`, `Ingredient`, and optionally `StockLot`.
- Creates negative `StockMovement` when approved or immediately when policy allows.

State transitions:

- `RECORDED -> APPROVED`
- `RECORDED -> REJECTED`

Events emitted:

- `inventory.waste.recorded.v1`
- `inventory.waste.approved.v1`
- `inventory.waste.rejected.v1`

Permissions:

- `inventory.waste.read`
- `inventory.waste.create`
- `inventory.waste.approve`

API ownership: `InventoryModule`

### 6.8 RecipeLine

Purpose: Maps menu items to ingredients for food cost, stock deduction, and AI inventory alerts.

Fields:

- `id`
- `organizationId`
- `menuItemId`
- `ingredientId`
- `quantity`
- `unitOfMeasure`
- `wasteFactorPercent`
- `isOptional`

Validation:

- Quantity must be greater than zero.
- Waste factor must be between 0 and 100.
- Unit must be compatible with ingredient unit.

Relationships:

- Belongs to `MenuItem`.
- Belongs to `Ingredient`.

State transitions:

- No lifecycle state; updates are audited.

Events emitted:

- `inventory.recipe_line.created.v1`
- `inventory.recipe_line.updated.v1`
- `inventory.recipe_line.deleted.v1`

Permissions:

- `inventory.recipe.read`
- `inventory.recipe.create`
- `inventory.recipe.update`
- `inventory.recipe.delete`

API ownership: `InventoryModule`

## 7. Orders, Kitchen, POS, and Finance Core

### 7.1 Order

Purpose: Represents a customer purchase request across dine-in, takeaway, delivery, POS, and future marketplace channels.

Fields:

- `id`
- `organizationId`
- `restaurantId`
- `branchId`
- `orderNumber`
- `channel`: `DINE_IN`, `TAKEAWAY`, `DELIVERY`, `POS`, `MARKETPLACE`
- `source`: `STAFF_POS`, `QR`, `PHONE`, `WEB`, `WHATSAPP`, `MARKETPLACE`, `API`
- `customerId`
- `tableId`
- `status`: `DRAFT`, `PLACED`, `ACCEPTED`, `IN_KITCHEN`, `READY`, `SERVED`, `OUT_FOR_DELIVERY`, `COMPLETED`, `CANCELLED`, `REFUNDED`
- `paymentStatus`: `UNPAID`, `PARTIALLY_PAID`, `PAID`, `REFUNDED`, `FAILED`
- `fulfillmentStatus`: `NOT_STARTED`, `PREPARING`, `READY`, `FULFILLED`, `FAILED`
- `subtotalMinor`
- `discountMinor`
- `taxMinor`
- `serviceChargeMinor`
- `deliveryFeeMinor`
- `totalMinor`
- `currency`
- `notes`
- `placedAt`
- `acceptedAt`
- `completedAt`
- `cancelledAt`
- `cancelReason`

Validation:

- `orderNumber` is unique per branch and business day.
- Non-draft orders require at least one order item.
- Total must equal item totals plus charges minus discounts.
- Dine-in orders require table when table service is enabled.
- Cancellation after kitchen preparation may require manager permission.

Relationships:

- Belongs to `Branch`.
- Optionally belongs to `Customer` and `DiningTable`.
- Has many `OrderItem`.
- Has kitchen tickets, payments, invoice, delivery assignment.

State transitions:

- `DRAFT -> PLACED`
- `PLACED -> ACCEPTED`
- `ACCEPTED -> IN_KITCHEN`
- `IN_KITCHEN -> READY`
- `READY -> SERVED`
- `READY -> OUT_FOR_DELIVERY`
- `SERVED -> COMPLETED`
- `OUT_FOR_DELIVERY -> COMPLETED`
- Any open state -> `CANCELLED` with rules
- `COMPLETED -> REFUNDED` through refund workflow

Events emitted:

- `orders.order.placed.v1`
- `orders.order.accepted.v1`
- `orders.order.sent_to_kitchen.v1`
- `orders.order.ready.v1`
- `orders.order.completed.v1`
- `orders.order.cancelled.v1`
- `orders.order.refunded.v1`

Permissions:

- `orders.order.read`
- `orders.order.create`
- `orders.order.update`
- `orders.order.cancel`
- `orders.order.refund`
- `orders.order.export`

API ownership: `OrdersModule`

### 7.2 OrderItem

Purpose: Captures a sellable item, selected modifiers, quantity, price snapshot, and kitchen routing.

Fields:

- `id`
- `organizationId`
- `orderId`
- `menuItemId`
- `nameSnapshot`
- `quantity`
- `unitPriceMinor`
- `discountMinor`
- `taxMinor`
- `lineTotalMinor`
- `currency`
- `specialInstructions`
- `status`: `PENDING`, `ACCEPTED`, `PREPARING`, `READY`, `SERVED`, `CANCELLED`, `VOIDED`

Validation:

- Quantity must be greater than zero.
- Price snapshot is required and must not change after order placement.
- Selected modifiers must satisfy modifier group rules.
- Voiding after payment may require refund or adjustment.

Relationships:

- Belongs to `Order`.
- References `MenuItem`.
- Has many selected modifier snapshots.
- Maps to kitchen ticket items.

State transitions:

- `PENDING -> ACCEPTED`
- `ACCEPTED -> PREPARING`
- `PREPARING -> READY`
- `READY -> SERVED`
- Any pre-served state -> `CANCELLED`
- Any state with manager approval -> `VOIDED`

Events emitted:

- `orders.order_item.added.v1`
- `orders.order_item.updated.v1`
- `orders.order_item.ready.v1`
- `orders.order_item.cancelled.v1`
- `orders.order_item.voided.v1`

Permissions:

- `orders.order.update`
- `orders.order.void_item`

API ownership: `OrdersModule`

### 7.3 KitchenTicket

Purpose: Routes order preparation work to the kitchen display system.

Fields:

- `id`
- `organizationId`
- `branchId`
- `orderId`
- `ticketNumber`
- `station`
- `priority`: `LOW`, `NORMAL`, `HIGH`, `URGENT`
- `status`: `QUEUED`, `ACCEPTED`, `PREPARING`, `READY`, `SERVED`, `CANCELLED`
- `printedAt`
- `acceptedAt`
- `readyAt`

Validation:

- Ticket number is unique per branch and business day.
- Ticket must have at least one ticket item.
- Cancelled order must cancel open kitchen tickets.

Relationships:

- Belongs to `Order`.
- Has many `KitchenTicketItem`.
- Assigned to kitchen station or department.

State transitions:

- `QUEUED -> ACCEPTED`
- `ACCEPTED -> PREPARING`
- `PREPARING -> READY`
- `READY -> SERVED`
- Any open state -> `CANCELLED`

Events emitted:

- `kitchen.ticket.created.v1`
- `kitchen.ticket.accepted.v1`
- `kitchen.ticket.preparing.v1`
- `kitchen.ticket.ready.v1`
- `kitchen.ticket.cancelled.v1`

Permissions:

- `kitchen.ticket.read`
- `kitchen.ticket.update`
- `kitchen.ticket.assign`
- `kitchen.ticket.cancel`

API ownership: `KitchenModule`

### 7.4 KitchenTicketItem

Purpose: Tracks kitchen preparation state for one order item or preparation unit.

Fields:

- `id`
- `organizationId`
- `kitchenTicketId`
- `orderItemId`
- `nameSnapshot`
- `quantity`
- `station`
- `status`: `QUEUED`, `PREPARING`, `READY`, `CANCELLED`

Validation:

- Quantity must be greater than zero.
- Status cannot move to ready if parent ticket is cancelled.

Relationships:

- Belongs to `KitchenTicket`.
- References `OrderItem`.

State transitions:

- `QUEUED -> PREPARING`
- `PREPARING -> READY`
- Any open state -> `CANCELLED`

Events emitted:

- `kitchen.ticket_item.status_changed.v1`

Permissions:

- `kitchen.ticket.update`

API ownership: `KitchenModule`

### 7.5 Payment

Purpose: Records money collected or attempted for an order.

Fields:

- `id`
- `organizationId`
- `branchId`
- `orderId`
- `paymentNumber`
- `provider`: `CASH`, `RAZORPAY`, `CASHFREE`, `STRIPE`, `PHONEPE`, `OTHER`
- `method`: `CASH`, `CARD`, `UPI`, `WALLET`, `BANK_TRANSFER`, `ONLINE`
- `status`: `PENDING`, `AUTHORIZED`, `CAPTURED`, `FAILED`, `CANCELLED`, `REFUNDED`, `PARTIALLY_REFUNDED`
- `amountMinor`
- `currency`
- `providerPaymentId`
- `providerOrderId`
- `failureCode`
- `failureMessage`
- `paidAt`

Validation:

- Amount must be greater than zero.
- Provider-specific fields are stored as external references, not used directly by business logic.
- Captured payments cannot be deleted.
- Refund cannot exceed captured amount.

Relationships:

- Belongs to `Order`.
- Has many refund records when refunds are split.
- References integration provider config.

State transitions:

- `PENDING -> AUTHORIZED`
- `AUTHORIZED -> CAPTURED`
- `PENDING -> FAILED`
- `AUTHORIZED -> CANCELLED`
- `CAPTURED -> PARTIALLY_REFUNDED`
- `CAPTURED -> REFUNDED`
- `PARTIALLY_REFUNDED -> REFUNDED`

Events emitted:

- `payments.payment.initiated.v1`
- `payments.payment.authorized.v1`
- `payments.payment.captured.v1`
- `payments.payment.failed.v1`
- `payments.payment.refunded.v1`

Permissions:

- `payments.payment.read`
- `payments.payment.create`
- `payments.payment.refund`
- `payments.payment.export`

API ownership: `PaymentsModule`

### 7.6 Invoice

Purpose: Legal and financial document generated for a completed or paid order.

Fields:

- `id`
- `organizationId`
- `branchId`
- `orderId`
- `invoiceNumber`
- `status`: `DRAFT`, `ISSUED`, `VOIDED`, `CREDITED`
- `customerName`
- `customerGstin`
- `billingAddress`
- `subtotalMinor`
- `discountMinor`
- `taxMinor`
- `totalMinor`
- `currency`
- `issuedAt`
- `voidedAt`
- `pdfUrl`

Validation:

- Invoice number is unique per branch and financial year.
- Issued invoice must be immutable except legal correction workflows.
- GST fields must validate when present.
- Voiding requires reason and permission.

Relationships:

- Belongs to `Order`.
- Has invoice line snapshots.
- Referenced by finance reports.

State transitions:

- `DRAFT -> ISSUED`
- `ISSUED -> VOIDED`
- `ISSUED -> CREDITED`

Events emitted:

- `finance.invoice.issued.v1`
- `finance.invoice.voided.v1`
- `finance.invoice.credited.v1`

Permissions:

- `finance.invoice.read`
- `finance.invoice.issue`
- `finance.invoice.void`
- `finance.invoice.export`

API ownership: `FinanceModule`

### 7.7 TaxCategory

Purpose: Defines tax rules applicable to menu items, charges, and invoices.

Fields:

- `id`
- `organizationId`
- `name`
- `countryCode`
- `taxType`: `GST`, `VAT`, `SALES_TAX`, `SERVICE_TAX`, `OTHER`
- `ratePercent`
- `isInclusive`
- `status`: `ACTIVE`, `INACTIVE`

Validation:

- Rate must be zero or positive.
- Active tax category must have valid country and tax type.

Relationships:

- Referenced by menu items and invoice lines.

State transitions:

- `ACTIVE -> INACTIVE`
- `INACTIVE -> ACTIVE`

Events emitted:

- `finance.tax_category.created.v1`
- `finance.tax_category.updated.v1`
- `finance.tax_category.deactivated.v1`

Permissions:

- `finance.tax.read`
- `finance.tax.create`
- `finance.tax.update`
- `finance.tax.delete`

API ownership: `FinanceModule`

## 8. CRM Domain

### 8.1 Customer

Purpose: Represents a guest or buyer across dine-in, takeaway, delivery, POS, and future channels.

Fields:

- `id`
- `organizationId`
- `restaurantId`
- `fullName`
- `phone`
- `email`
- `dateOfBirth`
- `anniversaryDate`
- `tags`
- `marketingOptIn`
- `whatsappOptIn`
- `emailOptIn`
- `smsOptIn`
- `lifetimeSpendMinor`
- `orderCount`
- `lastOrderAt`
- `status`: `ACTIVE`, `BLOCKED`, `MERGED`, `DELETED`

Validation:

- At least one contact method is required unless anonymous POS customer.
- Phone is unique per organization when present.
- Marketing flags must respect consent records.

Relationships:

- Has many orders.
- Has many addresses.
- Has wallet transactions, memberships, reviews.

State transitions:

- `ACTIVE -> BLOCKED`
- `BLOCKED -> ACTIVE`
- `ACTIVE -> MERGED`
- `ACTIVE -> DELETED`

Events emitted:

- `crm.customer.created.v1`
- `crm.customer.updated.v1`
- `crm.customer.merged.v1`
- `crm.customer.blocked.v1`

Permissions:

- `crm.customer.read`
- `crm.customer.create`
- `crm.customer.update`
- `crm.customer.delete`
- `crm.customer.export`

API ownership: `CrmModule`

### 8.2 CustomerAddress

Purpose: Delivery or billing address for a customer.

Fields:

- `id`
- `organizationId`
- `customerId`
- `label`
- `addressLine1`
- `addressLine2`
- `city`
- `state`
- `postalCode`
- `countryCode`
- `latitude`
- `longitude`
- `deliveryInstructions`
- `isDefault`
- `status`: `ACTIVE`, `ARCHIVED`

Validation:

- Address line, city, country, and postal code are required for delivery.
- Only one default active address per customer.
- Latitude and longitude must be valid when present.

Relationships:

- Belongs to `Customer`.
- Referenced by delivery orders.

State transitions:

- `ACTIVE -> ARCHIVED`
- `ARCHIVED -> ACTIVE`

Events emitted:

- `crm.customer_address.created.v1`
- `crm.customer_address.updated.v1`
- `crm.customer_address.archived.v1`

Permissions:

- `crm.customer.read`
- `crm.customer.update`

API ownership: `CrmModule`

### 8.3 Review

Purpose: Captures customer feedback for an order, item, branch, or delivery experience.

Fields:

- `id`
- `organizationId`
- `restaurantId`
- `branchId`
- `customerId`
- `orderId`
- `rating`
- `comment`
- `reviewSource`: `IN_APP`, `GOOGLE`, `ZOMATO`, `SWIGGY`, `MANUAL`
- `status`: `PENDING`, `PUBLISHED`, `HIDDEN`, `FLAGGED`
- `submittedAt`

Validation:

- Rating must be between 1 and 5.
- One first-party review per customer per order unless update workflow is supported.

Relationships:

- Belongs to `Customer`.
- Optionally belongs to `Order` and `Branch`.

State transitions:

- `PENDING -> PUBLISHED`
- `PENDING -> HIDDEN`
- `PUBLISHED -> FLAGGED`
- `FLAGGED -> HIDDEN`
- `FLAGGED -> PUBLISHED`

Events emitted:

- `crm.review.submitted.v1`
- `crm.review.published.v1`
- `crm.review.flagged.v1`

Permissions:

- `crm.review.read`
- `crm.review.moderate`
- `crm.review.export`

API ownership: `CrmModule`

### 8.4 WalletTransaction

Purpose: Records customer wallet credits and debits. V1 optional unless wallet is enabled.

Fields:

- `id`
- `organizationId`
- `customerId`
- `transactionType`: `CREDIT`, `DEBIT`, `REFUND`, `ADJUSTMENT`, `EXPIRY`
- `amountMinor`
- `currency`
- `balanceAfterMinor`
- `referenceType`
- `referenceId`
- `reason`

Validation:

- Amount must be greater than zero.
- Wallet balance cannot go negative unless explicitly configured.
- Immutable after creation.

Relationships:

- Belongs to `Customer`.
- Can reference order, payment, refund, campaign, or adjustment.

State transitions:

- Immutable.

Events emitted:

- `crm.wallet_transaction.recorded.v1`

Permissions:

- `crm.wallet.read`
- `crm.wallet.adjust`

API ownership: `CrmModule`

## 9. Delivery Domain

### 9.1 Driver

Purpose: Represents a delivery person for local fleet delivery. V1 optional if delivery is provider-only.

Fields:

- `id`
- `organizationId`
- `branchId`
- `employeeId`
- `name`
- `phone`
- `vehicleType`: `BIKE`, `CAR`, `CYCLE`, `WALK`, `OTHER`
- `vehicleNumber`
- `status`: `AVAILABLE`, `ASSIGNED`, `ON_BREAK`, `INACTIVE`

Validation:

- Name and phone are required.
- Active local driver must be linked to branch.

Relationships:

- Optionally linked to `Employee`.
- Has many delivery assignments.

State transitions:

- `AVAILABLE -> ASSIGNED`
- `ASSIGNED -> AVAILABLE`
- `AVAILABLE -> ON_BREAK`
- `ON_BREAK -> AVAILABLE`
- Any state -> `INACTIVE`

Events emitted:

- `delivery.driver.created.v1`
- `delivery.driver.status_changed.v1`

Permissions:

- `delivery.driver.read`
- `delivery.driver.create`
- `delivery.driver.update`
- `delivery.driver.assign`

API ownership: `DeliveryModule`

### 9.2 DeliveryAssignment

Purpose: Tracks delivery fulfillment for an order through local fleet or external provider.

Fields:

- `id`
- `organizationId`
- `branchId`
- `orderId`
- `customerAddressId`
- `provider`: `LOCAL_FLEET`, `PORTER`, `BORZO`, `UBER`, `SHADOWFAX`, `OTHER`
- `driverId`
- `providerTaskId`
- `status`: `PENDING`, `ASSIGNED`, `PICKED_UP`, `OUT_FOR_DELIVERY`, `DELIVERED`, `FAILED`, `CANCELLED`
- `pickupEta`
- `deliveryEta`
- `deliveredAt`
- `failureReason`
- `trackingUrl`

Validation:

- Delivery orders require address.
- Provider assignment must use provider interface.
- Completed delivery cannot be edited except correction notes.

Relationships:

- Belongs to `Order`.
- Belongs to `CustomerAddress`.
- Optionally belongs to local `Driver`.
- Has many delivery events.

State transitions:

- `PENDING -> ASSIGNED`
- `ASSIGNED -> PICKED_UP`
- `PICKED_UP -> OUT_FOR_DELIVERY`
- `OUT_FOR_DELIVERY -> DELIVERED`
- Any open state -> `FAILED`
- Any open state -> `CANCELLED`

Events emitted:

- `delivery.assignment.created.v1`
- `delivery.assignment.assigned.v1`
- `delivery.assignment.picked_up.v1`
- `delivery.assignment.delivered.v1`
- `delivery.assignment.failed.v1`

Permissions:

- `delivery.assignment.read`
- `delivery.assignment.create`
- `delivery.assignment.assign`
- `delivery.assignment.update`
- `delivery.assignment.cancel`

API ownership: `DeliveryModule`

### 9.3 DeliveryEvent

Purpose: Immutable timeline event for delivery tracking and provider callbacks.

Fields:

- `id`
- `organizationId`
- `deliveryAssignmentId`
- `eventType`
- `eventSource`: `LOCAL`, `PROVIDER_WEBHOOK`, `STAFF`
- `message`
- `latitude`
- `longitude`
- `occurredAt`
- `rawPayload`

Validation:

- Immutable after creation.
- External payload should be stored only if it does not contain unnecessary sensitive data.

Relationships:

- Belongs to `DeliveryAssignment`.

State transitions:

- Immutable.

Events emitted:

- `delivery.event.recorded.v1`

Permissions:

- `delivery.assignment.read`

API ownership: `DeliveryModule`

## 10. Marketing and Notifications Domain

### 10.1 Coupon

Purpose: Discount instrument for orders and campaigns. V1 can be basic percentage or fixed amount only.

Fields:

- `id`
- `organizationId`
- `restaurantId`
- `code`
- `name`
- `discountType`: `PERCENTAGE`, `FIXED_AMOUNT`, `FREE_DELIVERY`
- `discountValue`
- `maxDiscountMinor`
- `minimumOrderValueMinor`
- `usageLimitTotal`
- `usageLimitPerCustomer`
- `startsAt`
- `endsAt`
- `status`: `DRAFT`, `ACTIVE`, `PAUSED`, `EXPIRED`, `ARCHIVED`

Validation:

- Code is unique per organization.
- Discount value must be positive.
- Date range must be valid.
- Percentage discount cannot exceed 100.

Relationships:

- Used by orders.
- Can belong to campaign.

State transitions:

- `DRAFT -> ACTIVE`
- `ACTIVE -> PAUSED`
- `PAUSED -> ACTIVE`
- `ACTIVE -> EXPIRED`
- `ACTIVE -> ARCHIVED`

Events emitted:

- `marketing.coupon.created.v1`
- `marketing.coupon.activated.v1`
- `marketing.coupon.paused.v1`
- `marketing.coupon.redeemed.v1`

Permissions:

- `marketing.coupon.read`
- `marketing.coupon.create`
- `marketing.coupon.update`
- `marketing.coupon.delete`

API ownership: `MarketingModule`

### 10.2 NotificationTemplate

Purpose: Reusable message template for WhatsApp, SMS, email, and in-app notifications.

Fields:

- `id`
- `organizationId`
- `name`
- `channel`: `WHATSAPP`, `SMS`, `EMAIL`, `IN_APP`
- `templateKey`
- `subject`
- `body`
- `variables`
- `providerTemplateId`
- `status`: `DRAFT`, `PENDING_APPROVAL`, `ACTIVE`, `REJECTED`, `ARCHIVED`

Validation:

- Template key is unique per organization and channel.
- Provider-approved channels must store provider template ID.
- Variables must be declared and validated at send time.

Relationships:

- Used by `NotificationMessage`.
- Linked to provider config.

State transitions:

- `DRAFT -> PENDING_APPROVAL`
- `PENDING_APPROVAL -> ACTIVE`
- `PENDING_APPROVAL -> REJECTED`
- `ACTIVE -> ARCHIVED`

Events emitted:

- `notifications.template.created.v1`
- `notifications.template.approved.v1`
- `notifications.template.rejected.v1`

Permissions:

- `marketing.notification_template.read`
- `marketing.notification_template.create`
- `marketing.notification_template.update`
- `marketing.notification_template.delete`

API ownership: `NotificationsModule`

### 10.3 NotificationMessage

Purpose: Tracks an individual outbound notification attempt.

Fields:

- `id`
- `organizationId`
- `templateId`
- `recipientType`: `CUSTOMER`, `USER`, `EMPLOYEE`, `EXTERNAL`
- `recipientId`
- `recipientAddress`
- `channel`: `WHATSAPP`, `SMS`, `EMAIL`, `IN_APP`
- `status`: `QUEUED`, `SENT`, `DELIVERED`, `FAILED`, `CANCELLED`
- `provider`
- `providerMessageId`
- `payload`
- `failureReason`
- `queuedAt`
- `sentAt`
- `deliveredAt`

Validation:

- Recipient address is required.
- Channel must have active provider configuration.
- Failed messages may be retried with idempotency key.

Relationships:

- Optionally belongs to `NotificationTemplate`.
- Can reference order, payment, delivery, customer, or campaign.

State transitions:

- `QUEUED -> SENT`
- `SENT -> DELIVERED`
- `QUEUED -> FAILED`
- `SENT -> FAILED`
- `QUEUED -> CANCELLED`

Events emitted:

- `notifications.message.queued.v1`
- `notifications.message.sent.v1`
- `notifications.message.delivered.v1`
- `notifications.message.failed.v1`

Permissions:

- `marketing.notification.read`
- `marketing.notification.send`

API ownership: `NotificationsModule`

## 11. Integrations Domain

### 11.1 IntegrationProviderConfig

Purpose: Stores organization or branch configuration for external providers without leaking vendor logic into business domains.

Fields:

- `id`
- `organizationId`
- `branchId`
- `providerType`: `PAYMENT`, `DELIVERY`, `MARKETPLACE`, `WHATSAPP`, `SMS`, `EMAIL`, `MAPS`, `AI`, `STORAGE`
- `providerKey`
- `displayName`
- `status`: `DRAFT`, `ACTIVE`, `DISABLED`, `ERROR`
- `credentialsRef`
- `configJson`
- `webhookSecretRef`
- `lastHealthCheckAt`

Validation:

- Provider key must match a registered adapter.
- Secrets must not be stored in plain text in the table.
- Only one default active provider per provider type and branch unless multi-provider routing is configured.

Relationships:

- Referenced by payments, delivery assignments, notifications, storage, and AI gateway calls.

State transitions:

- `DRAFT -> ACTIVE`
- `ACTIVE -> DISABLED`
- `DISABLED -> ACTIVE`
- `ACTIVE -> ERROR`
- `ERROR -> ACTIVE`

Events emitted:

- `integrations.provider_config.created.v1`
- `integrations.provider_config.activated.v1`
- `integrations.provider_config.disabled.v1`
- `integrations.provider_config.health_failed.v1`

Permissions:

- `integrations.provider.read`
- `integrations.provider.create`
- `integrations.provider.update`
- `integrations.provider.delete`
- `integrations.provider.manage_secrets`

API ownership: `IntegrationsModule`

### 11.2 WebhookEvent

Purpose: Immutable record of inbound provider webhook payloads for idempotency, audit, and async processing.

Fields:

- `id`
- `organizationId`
- `providerConfigId`
- `providerType`
- `providerKey`
- `eventKey`
- `externalEventId`
- `status`: `RECEIVED`, `VERIFIED`, `PROCESSING`, `PROCESSED`, `FAILED`, `IGNORED`
- `headersJson`
- `payloadJson`
- `receivedAt`
- `processedAt`
- `failureReason`

Validation:

- `externalEventId` plus provider should be idempotent when provider supplies it.
- Payload should be size-limited.
- Signature verification must happen before business effects.

Relationships:

- Belongs to `IntegrationProviderConfig`.
- May create or update payments, deliveries, notifications, marketplace orders.

State transitions:

- `RECEIVED -> VERIFIED`
- `VERIFIED -> PROCESSING`
- `PROCESSING -> PROCESSED`
- Any processing state -> `FAILED`
- `VERIFIED -> IGNORED`

Events emitted:

- `integrations.webhook.received.v1`
- `integrations.webhook.processed.v1`
- `integrations.webhook.failed.v1`

Permissions:

- `integrations.webhook.read`
- `integrations.webhook.replay`

API ownership: `IntegrationsModule`

### 11.3 ExternalReference

Purpose: Generic mapping between FoodOS entity IDs and external provider IDs.

Fields:

- `id`
- `organizationId`
- `providerType`
- `providerKey`
- `entityType`
- `entityId`
- `externalId`
- `externalUrl`
- `metadata`

Validation:

- `(providerKey, entityType, entityId)` should be unique unless multiple external objects are expected.
- External ID is required.

Relationships:

- References any supported FoodOS entity by typed ID.

State transitions:

- No lifecycle state; records can be archived through soft delete.

Events emitted:

- `integrations.external_reference.created.v1`
- `integrations.external_reference.updated.v1`

Permissions:

- `integrations.reference.read`
- `integrations.reference.update`

API ownership: `IntegrationsModule`

## 12. Analytics and AI Domain

### 12.1 KpiSnapshot

Purpose: Stores computed business metrics by branch, restaurant, domain, and time window.

Fields:

- `id`
- `organizationId`
- `restaurantId`
- `branchId`
- `metricKey`
- `domain`
- `periodType`: `HOURLY`, `DAILY`, `WEEKLY`, `MONTHLY`
- `periodStart`
- `periodEnd`
- `valueNumeric`
- `valueJson`
- `computedAt`

Validation:

- Metric key must be registered.
- Period start must be before period end.
- Snapshot should be idempotent for metric, scope, and period.

Relationships:

- References branch and restaurant.
- Computed from orders, payments, inventory, CRM, marketing.

State transitions:

- Recomputed snapshots may be replaced by version or upserted.

Events emitted:

- `analytics.kpi_snapshot.computed.v1`

Permissions:

- `analytics.dashboard.read`
- `analytics.report.export`

API ownership: `AnalyticsModule`

### 12.2 DailyBusinessSummary

Purpose: AI-ready operational summary of sales, orders, customers, inventory, and issues for a branch or restaurant.

Fields:

- `id`
- `organizationId`
- `restaurantId`
- `branchId`
- `businessDate`
- `summaryText`
- `salesTotalMinor`
- `orderCount`
- `topItemsJson`
- `lowStockItemsJson`
- `customerHighlightsJson`
- `riskFlagsJson`
- `generatedBy`: `SYSTEM`, `AI`
- `generatedAt`

Validation:

- One canonical summary per branch per business date.
- Summary must cite source metric IDs or source query period in metadata.

Relationships:

- Uses `KpiSnapshot`, orders, payments, inventory, and customer records.
- Can create AI insights.

State transitions:

- No lifecycle state; regenerate with versioning when source data changes materially.

Events emitted:

- `ai.daily_business_summary.generated.v1`

Permissions:

- `ai.summary.read`
- `analytics.dashboard.read`

API ownership: `AiModule`

### 12.3 AIInsight

Purpose: Stores AI-generated insight, recommendation, warning, or explanation with traceability.

Fields:

- `id`
- `organizationId`
- `restaurantId`
- `branchId`
- `insightType`: `SALES`, `INVENTORY`, `KITCHEN`, `CUSTOMER`, `MARKETING`, `FINANCE`, `SUPPORT`
- `severity`: `INFO`, `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- `title`
- `body`
- `recommendation`
- `sourceEntityType`
- `sourceEntityId`
- `sourcePeriodStart`
- `sourcePeriodEnd`
- `modelProvider`
- `modelName`
- `confidenceScore`
- `status`: `NEW`, `ACKNOWLEDGED`, `ACTIONED`, `DISMISSED`, `EXPIRED`

Validation:

- Insight must be tied to a source entity or source period.
- Critical insights require deterministic evidence, not only model guesswork.
- Confidence score must be between 0 and 1 when present.

Relationships:

- Can reference any major domain entity.
- May create tasks in future staff/task domain.

State transitions:

- `NEW -> ACKNOWLEDGED`
- `ACKNOWLEDGED -> ACTIONED`
- `NEW -> DISMISSED`
- `ACKNOWLEDGED -> DISMISSED`
- Any open state -> `EXPIRED`

Events emitted:

- `ai.insight.generated.v1`
- `ai.insight.acknowledged.v1`
- `ai.insight.actioned.v1`
- `ai.insight.dismissed.v1`

Permissions:

- `ai.insight.read`
- `ai.insight.acknowledge`
- `ai.insight.dismiss`
- `ai.insight.manage`

API ownership: `AiModule`

### 12.4 InventoryAlert

Purpose: AI or rules-generated alert for low stock, expiry, abnormal usage, or purchasing recommendation.

Fields:

- `id`
- `organizationId`
- `branchId`
- `ingredientId`
- `alertType`: `LOW_STOCK`, `OUT_OF_STOCK`, `EXPIRING_SOON`, `ABNORMAL_USAGE`, `PURCHASE_RECOMMENDED`
- `severity`: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- `message`
- `recommendedQuantity`
- `unitOfMeasure`
- `source`: `RULE`, `AI`
- `status`: `OPEN`, `ACKNOWLEDGED`, `RESOLVED`, `DISMISSED`

Validation:

- Must reference an ingredient.
- Open alerts should be deduplicated by branch, ingredient, and alert type.

Relationships:

- Belongs to `Ingredient` and `Branch`.
- May generate purchase order draft.

State transitions:

- `OPEN -> ACKNOWLEDGED`
- `ACKNOWLEDGED -> RESOLVED`
- `OPEN -> RESOLVED`
- `OPEN -> DISMISSED`

Events emitted:

- `inventory.alert.created.v1`
- `inventory.alert.resolved.v1`
- `inventory.alert.dismissed.v1`

Permissions:

- `inventory.alert.read`
- `inventory.alert.update`
- `inventory.purchase.create`

API ownership: `InventoryModule` with AI enrichment through `AiModule`

## 13. Platform Event and Sync Entities

### 13.1 DomainEventOutbox

Purpose: Reliable transactionally written event queue for async processing, integrations, analytics, and AI.

Fields:

- `id`
- `organizationId`
- `eventName`
- `aggregateType`
- `aggregateId`
- `payloadJson`
- `metadataJson`
- `status`: `PENDING`, `PUBLISHED`, `FAILED`, `DEAD_LETTER`
- `occurredAt`
- `publishedAt`
- `attemptCount`
- `lastError`

Validation:

- Written inside the same transaction as aggregate mutation.
- Payload must include event schema version.
- Events should be append-only.

Relationships:

- References source aggregate by type and ID.

State transitions:

- `PENDING -> PUBLISHED`
- `PENDING -> FAILED`
- `FAILED -> PENDING`
- `FAILED -> DEAD_LETTER`

Events emitted:

- This entity stores events rather than emitting business events itself.

Permissions:

- System only.
- Admin read for diagnostics.

API ownership: `PlatformModule`

### 13.2 AuditLog

Purpose: Immutable record of important user or system actions.

Fields:

- `id`
- `organizationId`
- `actorUserId`
- `actorType`: `USER`, `SYSTEM`, `PROVIDER`, `AI`
- `action`
- `entityType`
- `entityId`
- `beforeJson`
- `afterJson`
- `ipAddress`
- `userAgent`
- `occurredAt`

Validation:

- Immutable after creation.
- Sensitive fields must be redacted.
- High-risk actions must be audited.

Relationships:

- References user and target entity by typed ID.

State transitions:

- Immutable.

Events emitted:

- None normally.

Permissions:

- `platform.audit.read`
- `platform.audit.export`

API ownership: `PlatformModule`

### 13.3 OfflineSyncRecord

Purpose: Tracks offline client mutations and conflict resolution for POS, KDS, and branch operations.

Fields:

- `id`
- `organizationId`
- `branchId`
- `clientId`
- `deviceId`
- `entityType`
- `entityId`
- `operation`: `CREATE`, `UPDATE`, `DELETE`
- `clientVersion`
- `serverVersion`
- `payloadJson`
- `status`: `PENDING`, `APPLIED`, `CONFLICT`, `REJECTED`
- `conflictReason`
- `receivedAt`
- `appliedAt`

Validation:

- Idempotency key is required per offline mutation.
- Mutations must be scoped to the authenticated branch and device.
- Conflict resolution must not silently overwrite server state for financial records.

Relationships:

- References target entity by typed ID.
- Linked to device/session metadata.

State transitions:

- `PENDING -> APPLIED`
- `PENDING -> CONFLICT`
- `PENDING -> REJECTED`
- `CONFLICT -> APPLIED` after manual or policy resolution

Events emitted:

- `platform.offline_sync.applied.v1`
- `platform.offline_sync.conflict_detected.v1`
- `platform.offline_sync.rejected.v1`

Permissions:

- System authenticated device writes.
- `platform.sync.read` for diagnostics.

API ownership: `PlatformModule`

## 14. Provider Interfaces

Business domains should depend on interfaces, not vendors.

### 14.1 PaymentProvider

Methods:

- `createPaymentIntent(input)`
- `capturePayment(input)`
- `refundPayment(input)`
- `verifyWebhook(input)`
- `getPaymentStatus(input)`

Business objects affected:

- `Payment`
- `Order`
- `Invoice`
- `WebhookEvent`
- `ExternalReference`

Initial providers:

- Cash
- Razorpay
- Cashfree
- Stripe
- PhonePe

### 14.2 DeliveryProvider

Methods:

- `quoteDelivery(input)`
- `createDeliveryTask(input)`
- `cancelDeliveryTask(input)`
- `trackDelivery(input)`
- `verifyWebhook(input)`

Business objects affected:

- `DeliveryAssignment`
- `DeliveryEvent`
- `Order`
- `WebhookEvent`
- `ExternalReference`

Initial providers:

- Local Fleet
- Porter
- Borzo
- Uber
- Shadowfax

### 14.3 NotificationProvider

Methods:

- `sendMessage(input)`
- `renderTemplate(input)`
- `verifyWebhook(input)`
- `getDeliveryStatus(input)`

Business objects affected:

- `NotificationTemplate`
- `NotificationMessage`
- `Customer`
- `Order`

Initial providers:

- WhatsApp provider
- SMS provider
- Email provider

### 14.4 MapsProvider

Methods:

- `geocode(input)`
- `reverseGeocode(input)`
- `calculateDistance(input)`
- `calculateEta(input)`

Business objects affected:

- `Branch`
- `CustomerAddress`
- `DeliveryAssignment`

## 15. V1 Build Checklist

### 15.1 Sprint 1 required entities

- User
- Membership
- Role
- Permission
- Organization
- Restaurant
- Branch
- Department
- DiningTable
- BranchSettings
- Employee
- AuditLog

### 15.2 Sprint 2 required entities

- Menu
- MenuCategory
- MenuItem
- MenuItemPlacement
- ModifierGroup
- ModifierOption
- PriceRule
- ItemAvailability
- TaxCategory

### 15.3 Sprint 3 required entities

- Order
- OrderItem
- KitchenTicket
- KitchenTicketItem
- DomainEventOutbox
- NotificationMessage

### 15.4 Sprint 4 required entities

- Ingredient
- StockLot
- StockMovement
- Supplier
- PurchaseOrder
- PurchaseOrderLine
- WasteEntry
- RecipeLine
- InventoryAlert

### 15.5 Sprint 5 required entities

- Payment
- Invoice
- IntegrationProviderConfig
- WebhookEvent
- ExternalReference

### 15.6 Sprint 6 required entities

- Customer
- CustomerAddress
- Review
- WalletTransaction, if wallet is enabled

### 15.7 Sprint 7 required entities

- Driver, if local fleet is enabled
- DeliveryAssignment
- DeliveryEvent

### 15.8 Sprint 8 required entities

- KpiSnapshot
- DailyBusinessSummary

### 15.9 Sprint 9 required entities

- AIInsight
- DailyBusinessSummary enrichment
- InventoryAlert AI enrichment

## 16. Entities Excluded From V1

These should not be built in V1 except as placeholder enums, interfaces, or future-safe references:

- FranchiseAgreement
- SupplierMarketplaceListing
- CorporateCateringContract
- ConsumerMarketplaceProfile
- VoiceOrderSession
- DynamicPricingRule
- AdvancedForecastModel
- AiAutomationMarketplaceApp
- HotelRoomServiceAccount
- TempleKitchenDonation

## 17. Open Decisions Before Schema Generation

1. ID format: UUID v7 or ULID is recommended for sortable IDs.
2. Auth ownership: Better Auth should own auth credentials; FoodOS owns `User`, memberships, and RBAC.
3. Multi-branch menu inheritance: decide whether branch overrides are separate items or scoped price and availability rules. This document recommends scoped rules first.
4. Inventory costing: decide FIFO, weighted average, or configurable costing. FIFO is recommended for perishables.
5. Offline sync conflict policy: financial and payment records should require strict server reconciliation.
6. Event transport: NATS should consume outbox events after transaction commit.
7. File storage: images and invoice PDFs should use MinIO through a storage provider interface.

## 18. Implementation Sequence

Recommended immediate next steps:

1. Convert this entity bible into Prisma models for Sprint 1 and Sprint 2 only.
2. Seed system permissions and default roles.
3. Build tenant scoping middleware and RBAC guard before any business API.
4. Implement outbox and audit logging early.
5. Add branch-aware service day utilities before orders and reporting.
6. Define provider interfaces before integrating payment, notification, delivery, or maps vendors.

