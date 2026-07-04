# FoodOS Split Documentation

This folder is the token-efficient working version of the FoodOS Entity Bible.

The full source remains:

- ../FoodOS_Business_Objects_Entity_Bible_v1.md

For coding work, do not load the full source by default. Load the small spine files plus the relevant domain and sprint files.

## Default Loading Rule

Always load:

- 00_PROJECT_CONTEXT.md
- 02_DOMAIN_MAP.md
- 03_SHARED_MODELING_RULES.md

Then load:

- the relevant domains/*.md file
- upstream dependency domain files only when needed
- the matching implementation/sprint_*.md file

## Common Context Bundles

Foundation and auth:

- 00_PROJECT_CONTEXT.md
- 02_DOMAIN_MAP.md
- 03_SHARED_MODELING_RULES.md
- 04_PERMISSIONS_AND_EVENTS.md
- domains/01_identity.md
- domains/02_restaurant.md
- domains/03_staff.md
- domains/13_platform_sync_audit.md
- implementation/sprint_01_foundation.md

Menu:

- 00_PROJECT_CONTEXT.md
- 02_DOMAIN_MAP.md
- 03_SHARED_MODELING_RULES.md
- 04_PERMISSIONS_AND_EVENTS.md
- domains/02_restaurant.md
- domains/04_menu.md
- implementation/sprint_02_menu.md

Orders and kitchen:

- 00_PROJECT_CONTEXT.md
- 02_DOMAIN_MAP.md
- 03_SHARED_MODELING_RULES.md
- 04_PERMISSIONS_AND_EVENTS.md
- domains/02_restaurant.md
- domains/04_menu.md
- domains/06_orders_kitchen_pos.md
- domains/13_platform_sync_audit.md
- implementation/sprint_03_orders_kitchen.md

Inventory:

- 00_PROJECT_CONTEXT.md
- 02_DOMAIN_MAP.md
- 03_SHARED_MODELING_RULES.md
- 04_PERMISSIONS_AND_EVENTS.md
- domains/02_restaurant.md
- domains/04_menu.md
- domains/05_inventory.md
- implementation/sprint_04_inventory.md

Payments and finance:

- 00_PROJECT_CONTEXT.md
- 02_DOMAIN_MAP.md
- 03_SHARED_MODELING_RULES.md
- 04_PERMISSIONS_AND_EVENTS.md
- domains/06_orders_kitchen_pos.md
- domains/07_finance.md
- domains/11_integrations.md
- implementation/sprint_05_pos_payments_finance.md

CRM:

- 00_PROJECT_CONTEXT.md
- 02_DOMAIN_MAP.md
- 03_SHARED_MODELING_RULES.md
- 04_PERMISSIONS_AND_EVENTS.md
- domains/08_crm.md
- domains/06_orders_kitchen_pos.md
- implementation/sprint_06_crm.md

Delivery:

- 00_PROJECT_CONTEXT.md
- 02_DOMAIN_MAP.md
- 03_SHARED_MODELING_RULES.md
- 04_PERMISSIONS_AND_EVENTS.md
- domains/09_delivery.md
- domains/08_crm.md
- domains/06_orders_kitchen_pos.md
- domains/11_integrations.md
- implementation/sprint_07_delivery.md

Analytics and AI:

- 00_PROJECT_CONTEXT.md
- 02_DOMAIN_MAP.md
- 03_SHARED_MODELING_RULES.md
- domains/12_analytics_ai.md
- domains/05_inventory.md
- domains/06_orders_kitchen_pos.md
- implementation/sprint_08_analytics.md
- implementation/sprint_09_ai.md

## Duplication Rule

Each entity has exactly one owning domain file. Other files should reference it by name and path, not duplicate the full definition.

