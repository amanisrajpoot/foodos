# Sprint 01 Foundation

Generated from FoodOS_Business_Objects_Entity_Bible_v1.md.
Use this file as focused context; keep the master entity bible as the full archive.

Load with:
- 00_PROJECT_CONTEXT.md
- 01_DEVELOPMENT_SEQUENCE.md
- 03_SHARED_MODELING_RULES.md
- domains/01_identity.md
- domains/02_restaurant.md
- domains/03_staff.md
- domains/13_platform_sync_audit.md

### 15.1 Sprint 1 required entities

- User
- Membership
- Role
- Permission
- Organization
- Restaurant
- Branch
- Department
- DiningTable
- BranchSettings
- Employee
- AuditLog

## Required Context

Load these files for this sprint:

- domains/01_identity.md
- domains/02_restaurant.md
- domains/03_staff.md
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

