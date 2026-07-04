# Orders, Kitchen, POS Domain

Generated from FoodOS_Business_Objects_Entity_Bible_v1.md.
Use this file as focused context; keep the master entity bible as the full archive.

Load with:
- 00_PROJECT_CONTEXT.md
- domains/02_restaurant.md
- domains/04_menu.md
- domains/08_crm.md

## Orders, Kitchen, and POS

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

