# Restaurant Domain

Generated from FoodOS_Business_Objects_Entity_Bible_v1.md.
Use this file as focused context; keep the master entity bible as the full archive.

Load with:
- 00_PROJECT_CONTEXT.md
- domains/01_identity.md
- 03_SHARED_MODELING_RULES.md

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

