# FoodOS Domain Map

Generated from FoodOS_Business_Objects_Entity_Bible_v1.md.
Use this file as focused context; keep the master entity bible as the full archive.

Load with:
- 00_PROJECT_CONTEXT.md

### 1.1 Domain ownership

Every entity has one owning domain. Other domains can reference it by ID but should not own its lifecycle.

| Domain | Owns |
| --- | --- |
| Identity | User, Role, Permission, Membership |
| Restaurant | Organization, Restaurant, Branch, Department, Table, Settings |
| Menu | Menu, Category, Item, Modifier, Combo, Pricing, Availability |
| Inventory | Ingredient, Stock, Supplier, Purchase, Waste, Recipe |
| Orders | Order, Order Item, Kitchen Ticket, Payment, Invoice |
| CRM | Customer, Customer Address, Wallet, Membership, Review |
| Delivery | Delivery Assignment, Driver, Delivery Event |
| Finance | Expense, Tax, Settlement, Report Snapshot |
| Marketing | Campaign, Coupon, Notification |
| Analytics | KPI Snapshot, Dashboard Metric |
| AI | AI Insight, AI Summary, AI Recommendation |
| Integrations | Provider Config, Webhook, External Reference |

## Domain File Index

| Domain | File |
| --- | --- |
| Identity | domains/01_identity.md |
| Restaurant | domains/02_restaurant.md |
| Staff | domains/03_staff.md |
| Menu | domains/04_menu.md |
| Inventory | domains/05_inventory.md |
| Orders, Kitchen, POS | domains/06_orders_kitchen_pos.md |
| Finance | domains/07_finance.md |
| CRM | domains/08_crm.md |
| Delivery | domains/09_delivery.md |
| Marketing and Notifications | domains/10_marketing_notifications.md |
| Integrations | domains/11_integrations.md |
| Analytics and AI | domains/12_analytics_ai.md |
| Platform sync and audit | domains/13_platform_sync_audit.md |

### 1.2 Dependency order

Implementation should follow this dependency chain:

Authentication -> Organizations -> Restaurants -> Branches -> Users -> Roles -> Menus -> Inventory -> Orders -> Kitchen -> Payments -> Delivery -> CRM -> Marketing -> Analytics -> AI

Rules:

- A lower-level domain must not depend directly on a later domain.
- Later domains can reference earlier domains by ID.
- Cross-domain side effects should use events, not direct calls where practical.
- Integration adapters must implement provider interfaces. Business logic must not depend on vendor-specific classes.

