# Inventory Domain

Generated from FoodOS_Business_Objects_Entity_Bible_v1.md.
Use this file as focused context; keep the master entity bible as the full archive.

Load with:
- 00_PROJECT_CONTEXT.md
- domains/02_restaurant.md
- domains/04_menu.md

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

