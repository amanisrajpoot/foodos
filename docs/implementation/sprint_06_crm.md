# Sprint 06 CRM

Generated from FoodOS_Business_Objects_Entity_Bible_v1.md.
Use this file as focused context; keep the master entity bible as the full archive.

Load with:
- 00_PROJECT_CONTEXT.md
- 01_DEVELOPMENT_SEQUENCE.md
- 03_SHARED_MODELING_RULES.md
- domains/08_crm.md
- domains/06_orders_kitchen_pos.md

### 15.6 Sprint 6 required entities

- Customer
- CustomerAddress
- Review
- WalletTransaction, if wallet is enabled

## Required Context

Load these files for this sprint:

- domains/08_crm.md
- domains/06_orders_kitchen_pos.md


## Sequence Guardrails

### 1.2 Dependency order

Implementation should follow this dependency chain:

Authentication -> Organizations -> Restaurants -> Branches -> Users -> Roles -> Menus -> Inventory -> Orders -> Kitchen -> Payments -> Delivery -> CRM -> Marketing -> Analytics -> AI

Rules:

- A lower-level domain must not depend directly on a later domain.
- Later domains can reference earlier domains by ID.
- Cross-domain side effects should use events, not direct calls where practical.
- Integration adapters must implement provider interfaces. Business logic must not depend on vendor-specific classes.

