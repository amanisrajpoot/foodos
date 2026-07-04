# FoodOS Development Sequence

Generated from FoodOS_Business_Objects_Entity_Bible_v1.md.
Use this file as focused context; keep the master entity bible as the full archive.

Load with:
- 00_PROJECT_CONTEXT.md
- 02_DOMAIN_MAP.md

### 1.2 Dependency order

Implementation should follow this dependency chain:

Authentication -> Organizations -> Restaurants -> Branches -> Users -> Roles -> Menus -> Inventory -> Orders -> Kitchen -> Payments -> Delivery -> CRM -> Marketing -> Analytics -> AI

Rules:

- A lower-level domain must not depend directly on a later domain.
- Later domains can reference earlier domains by ID.
- Cross-domain side effects should use events, not direct calls where practical.
- Integration adapters must implement provider interfaces. Business logic must not depend on vendor-specific classes.

## 15. V1 Build Checklist

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

### 15.3 Sprint 3 required entities

- Order
- OrderItem
- KitchenTicket
- KitchenTicketItem
- DomainEventOutbox
- NotificationMessage

### 15.4 Sprint 4 required entities

- Ingredient
- StockLot
- StockMovement
- Supplier
- PurchaseOrder
- PurchaseOrderLine
- WasteEntry
- RecipeLine
- InventoryAlert

### 15.5 Sprint 5 required entities

- Payment
- Invoice
- IntegrationProviderConfig
- WebhookEvent
- ExternalReference

### 15.6 Sprint 6 required entities

- Customer
- CustomerAddress
- Review
- WalletTransaction, if wallet is enabled

### 15.7 Sprint 7 required entities

- Driver, if local fleet is enabled
- DeliveryAssignment
- DeliveryEvent

### 15.8 Sprint 8 required entities

- KpiSnapshot
- DailyBusinessSummary

### 15.9 Sprint 9 required entities

- AIInsight
- DailyBusinessSummary enrichment
- InventoryAlert AI enrichment

## 18. Implementation Sequence

Recommended immediate next steps:

1. Convert this entity bible into Prisma models for Sprint 1 and Sprint 2 only.
2. Seed system permissions and default roles.
3. Build tenant scoping middleware and RBAC guard before any business API.
4. Implement outbox and audit logging early.
5. Add branch-aware service day utilities before orders and reporting.
6. Define provider interfaces before integrating payment, notification, delivery, or maps vendors.

