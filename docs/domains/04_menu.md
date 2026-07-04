# Menu Domain

Generated from FoodOS_Business_Objects_Entity_Bible_v1.md.
Use this file as focused context; keep the master entity bible as the full archive.

Load with:
- 00_PROJECT_CONTEXT.md
- domains/02_restaurant.md
- 03_SHARED_MODELING_RULES.md

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

