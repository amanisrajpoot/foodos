# Sprint 03 Orders and Kitchen

Generated from FoodOS_Business_Objects_Entity_Bible_v1.md.
Use this file as focused context; keep the master entity bible as the full archive.

Load with:
- 00_PROJECT_CONTEXT.md
- 01_DEVELOPMENT_SEQUENCE.md
- 03_SHARED_MODELING_RULES.md
- domains/06_orders_kitchen_pos.md
- domains/10_marketing_notifications.md
- domains/13_platform_sync_audit.md

### 15.3 Sprint 3 required entities

- Order
- OrderItem
- KitchenTicket
- KitchenTicketItem
- DomainEventOutbox
- NotificationMessage

## Required Context

Load these files for this sprint:

- domains/06_orders_kitchen_pos.md
- domains/10_marketing_notifications.md
- domains/13_platform_sync_audit.md


## Sequence Guardrails

### 1.2 Dependency order

Implementation should follow this dependency chain:

Authentication -> Organizations -> Restaurants -> Branches -> Users -> Roles -> Menus -> Inventory -> Orders -> Kitchen -> Payments -> Delivery -> CRM -> Marketing -> Analytics -> AI

Rules:

- A lower-level domain must not depend directly on a later domain.
- Later domains can reference earlier domains by ID.
- Cross-domain side effects should use events, not direct calls where practical.
- Integration adapters must implement provider interfaces. Business logic must not depend on vendor-specific classes.

