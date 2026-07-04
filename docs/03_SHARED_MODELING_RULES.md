# FoodOS Shared Modeling Rules

Generated from FoodOS_Business_Objects_Entity_Bible_v1.md.
Use this file as focused context; keep the master entity bible as the full archive.

Load with:
- 00_PROJECT_CONTEXT.md
- 02_DOMAIN_MAP.md

### 1.3 Global fields

Unless explicitly excluded, every persisted entity should include:

| Field | Type | Rule |
| --- | --- | --- |
| id | UUID or ULID | Primary identifier, never reused |
| organizationId | UUID | Required for tenant-owned objects |
| createdAt | DateTime | Server generated |
| updatedAt | DateTime | Server generated |
| deletedAt | DateTime nullable | Soft delete where deletion is allowed |
| createdByUserId | UUID nullable | Required for back-office actions when available |
| updatedByUserId | UUID nullable | Required for back-office actions when available |
| version | Int | Optimistic concurrency for offline sync and conflict detection |

Exceptions:

- Public immutable event records may not use `updatedAt`.
- Global system catalogs may not have `organizationId`.
- Authentication provider records may be owned by Better Auth and mapped into FoodOS through `User`.

### 1.4 Tenant and branch scoping

| Scope | Meaning |
| --- | --- |
| Organization scoped | Shared across all restaurants and branches under a tenant |
| Restaurant scoped | Shared across branches of one restaurant brand |
| Branch scoped | Operational object for a physical or virtual branch |
| User scoped | Personal state or preferences |

Rules:

- All operational reads must be scoped by `organizationId`.
- Branch-level users should not access another branch unless their role grants it.
- Menu, inventory, orders, kitchen, POS, and delivery are branch-sensitive even when configured at restaurant level.

### 1.5 Money, tax, and time

- Store money in minor units: `amountMinor: Int`.
- Store currency as ISO code: `currency: String`, default `INR` for India deployments.
- Tax fields should support GST now and future tax regimes later.
- Store all timestamps in UTC.
- Store branch timezone on `Branch`.
- Business-day reporting should use branch timezone and configurable service day cutover.

### 1.8 API ownership

Each entity card declares the owning API module. Modules should expose clear application services. Database access should stay inside the owning module unless a read model is intentionally created.

Recommended NestJS module shape:

- `domain.module.ts`
- `application/*.service.ts`
- `domain/entities`
- `domain/events`
- `infrastructure/prisma`
- `presentation/http`
- `presentation/websocket` where needed

