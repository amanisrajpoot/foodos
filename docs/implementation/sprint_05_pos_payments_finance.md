# Sprint 05 POS Payments Finance

Generated from FoodOS_Business_Objects_Entity_Bible_v1.md.
Use this file as focused context; keep the master entity bible as the full archive.

Load with:
- 00_PROJECT_CONTEXT.md
- 01_DEVELOPMENT_SEQUENCE.md
- 03_SHARED_MODELING_RULES.md
- domains/06_orders_kitchen_pos.md
- domains/07_finance.md
- domains/11_integrations.md

### 15.5 Sprint 5 required entities

- Payment
- Invoice
- IntegrationProviderConfig
- WebhookEvent
- ExternalReference

## Required Context

Load these files for this sprint:

- domains/06_orders_kitchen_pos.md
- domains/07_finance.md
- domains/11_integrations.md


## Sequence Guardrails

### 1.2 Dependency order

Implementation should follow this dependency chain:

Authentication -> Organizations -> Restaurants -> Branches -> Users -> Roles -> Menus -> Inventory -> Orders -> Kitchen -> Payments -> Delivery -> CRM -> Marketing -> Analytics -> AI

Rules:

- A lower-level domain must not depend directly on a later domain.
- Later domains can reference earlier domains by ID.
- Cross-domain side effects should use events, not direct calls where practical.
- Integration adapters must implement provider interfaces. Business logic must not depend on vendor-specific classes.

