# Sprint 02 Menu

Generated from FoodOS_Business_Objects_Entity_Bible_v1.md.
Use this file as focused context; keep the master entity bible as the full archive.

Load with:
- 00_PROJECT_CONTEXT.md
- 01_DEVELOPMENT_SEQUENCE.md
- 03_SHARED_MODELING_RULES.md
- domains/02_restaurant.md
- domains/04_menu.md
- domains/07_finance.md

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

## Required Context

Load these files for this sprint:

- domains/02_restaurant.md
- domains/04_menu.md
- domains/07_finance.md


## Sequence Guardrails

### 1.2 Dependency order

Implementation should follow this dependency chain:

Authentication -> Organizations -> Restaurants -> Branches -> Users -> Roles -> Menus -> Inventory -> Orders -> Kitchen -> Payments -> Delivery -> CRM -> Marketing -> Analytics -> AI

Rules:

- A lower-level domain must not depend directly on a later domain.
- Later domains can reference earlier domains by ID.
- Cross-domain side effects should use events, not direct calls where practical.
- Integration adapters must implement provider interfaces. Business logic must not depend on vendor-specific classes.

