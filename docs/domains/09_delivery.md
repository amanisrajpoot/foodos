# Delivery Domain

Generated from FoodOS_Business_Objects_Entity_Bible_v1.md.
Use this file as focused context; keep the master entity bible as the full archive.

Load with:
- 00_PROJECT_CONTEXT.md
- domains/06_orders_kitchen_pos.md
- domains/08_crm.md
- domains/11_integrations.md

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

