# FoodOS Permissions and Events

Generated from FoodOS_Business_Objects_Entity_Bible_v1.md.
Use this file as focused context; keep the master entity bible as the full archive.

Load with:
- 00_PROJECT_CONTEXT.md
- 03_SHARED_MODELING_RULES.md

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

