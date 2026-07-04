# FoodOS Project Context

Status: Product development source of truth

Scope: Version 1 MVP plus explicit future placeholders

Architecture style: Domain Driven, multi-tenant, integration-first, AI-native

FoodOS is organized around business domains, not screens or isolated features. Every implementation decision should preserve tenant isolation, domain ownership, provider abstraction, auditability, and future offline sync.

## Core Rules

- Every entity has one owning domain.
- Other domains reference foreign entities by ID and use events for cross-domain side effects where practical.
- Business logic must depend on provider interfaces, not direct vendors.
- Operational reads must be scoped by organizationId.
- Branch-level operational data must respect ranchId.
- Meaningful lifecycle changes should emit domain events through the outbox.
- Keep V1 focused. Do not implement future entities unless the sprint explicitly requires a placeholder.

### 1.2 Dependency order

Implementation should follow this dependency chain:

Authentication -> Organizations -> Restaurants -> Branches -> Users -> Roles -> Menus -> Inventory -> Orders -> Kitchen -> Payments -> Delivery -> CRM -> Marketing -> Analytics -> AI

Rules:

- A lower-level domain must not depend directly on a later domain.
- Later domains can reference earlier domains by ID.
- Cross-domain side effects should use events, not direct calls where practical.
- Integration adapters must implement provider interfaces. Business logic must not depend on vendor-specific classes.

## 16. Entities Excluded From V1

These should not be built in V1 except as placeholder enums, interfaces, or future-safe references:

- FranchiseAgreement
- SupplierMarketplaceListing
- CorporateCateringContract
- ConsumerMarketplaceProfile
- VoiceOrderSession
- DynamicPricingRule
- AdvancedForecastModel
- AiAutomationMarketplaceApp
- HotelRoomServiceAccount
- TempleKitchenDonation

## 17. Open Decisions Before Schema Generation

1. ID format: UUID v7 or ULID is recommended for sortable IDs.
2. Auth ownership: Better Auth should own auth credentials; FoodOS owns `User`, memberships, and RBAC.
3. Multi-branch menu inheritance: decide whether branch overrides are separate items or scoped price and availability rules. This document recommends scoped rules first.
4. Inventory costing: decide FIFO, weighted average, or configurable costing. FIFO is recommended for perishables.
5. Offline sync conflict policy: financial and payment records should require strict server reconciliation.
6. Event transport: NATS should consume outbox events after transaction commit.
7. File storage: images and invoice PDFs should use MinIO through a storage provider interface.

