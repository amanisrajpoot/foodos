# Analytics and AI Domain

Generated from FoodOS_Business_Objects_Entity_Bible_v1.md.
Use this file as focused context; keep the master entity bible as the full archive.

Load with:
- 00_PROJECT_CONTEXT.md
- domains/05_inventory.md
- domains/06_orders_kitchen_pos.md

## 12. Analytics and AI Domain

### 12.1 KpiSnapshot

Purpose: Stores computed business metrics by branch, restaurant, domain, and time window.

Fields:

- `id`
- `organizationId`
- `restaurantId`
- `branchId`
- `metricKey`
- `domain`
- `periodType`: `HOURLY`, `DAILY`, `WEEKLY`, `MONTHLY`
- `periodStart`
- `periodEnd`
- `valueNumeric`
- `valueJson`
- `computedAt`

Validation:

- Metric key must be registered.
- Period start must be before period end.
- Snapshot should be idempotent for metric, scope, and period.

Relationships:

- References branch and restaurant.
- Computed from orders, payments, inventory, CRM, marketing.

State transitions:

- Recomputed snapshots may be replaced by version or upserted.

Events emitted:

- `analytics.kpi_snapshot.computed.v1`

Permissions:

- `analytics.dashboard.read`
- `analytics.report.export`

API ownership: `AnalyticsModule`

### 12.2 DailyBusinessSummary

Purpose: AI-ready operational summary of sales, orders, customers, inventory, and issues for a branch or restaurant.

Fields:

- `id`
- `organizationId`
- `restaurantId`
- `branchId`
- `businessDate`
- `summaryText`
- `salesTotalMinor`
- `orderCount`
- `topItemsJson`
- `lowStockItemsJson`
- `customerHighlightsJson`
- `riskFlagsJson`
- `generatedBy`: `SYSTEM`, `AI`
- `generatedAt`

Validation:

- One canonical summary per branch per business date.
- Summary must cite source metric IDs or source query period in metadata.

Relationships:

- Uses `KpiSnapshot`, orders, payments, inventory, and customer records.
- Can create AI insights.

State transitions:

- No lifecycle state; regenerate with versioning when source data changes materially.

Events emitted:

- `ai.daily_business_summary.generated.v1`

Permissions:

- `ai.summary.read`
- `analytics.dashboard.read`

API ownership: `AiModule`

### 12.3 AIInsight

Purpose: Stores AI-generated insight, recommendation, warning, or explanation with traceability.

Fields:

- `id`
- `organizationId`
- `restaurantId`
- `branchId`
- `insightType`: `SALES`, `INVENTORY`, `KITCHEN`, `CUSTOMER`, `MARKETING`, `FINANCE`, `SUPPORT`
- `severity`: `INFO`, `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- `title`
- `body`
- `recommendation`
- `sourceEntityType`
- `sourceEntityId`
- `sourcePeriodStart`
- `sourcePeriodEnd`
- `modelProvider`
- `modelName`
- `confidenceScore`
- `status`: `NEW`, `ACKNOWLEDGED`, `ACTIONED`, `DISMISSED`, `EXPIRED`

Validation:

- Insight must be tied to a source entity or source period.
- Critical insights require deterministic evidence, not only model guesswork.
- Confidence score must be between 0 and 1 when present.

Relationships:

- Can reference any major domain entity.
- May create tasks in future staff/task domain.

State transitions:

- `NEW -> ACKNOWLEDGED`
- `ACKNOWLEDGED -> ACTIONED`
- `NEW -> DISMISSED`
- `ACKNOWLEDGED -> DISMISSED`
- Any open state -> `EXPIRED`

Events emitted:

- `ai.insight.generated.v1`
- `ai.insight.acknowledged.v1`
- `ai.insight.actioned.v1`
- `ai.insight.dismissed.v1`

Permissions:

- `ai.insight.read`
- `ai.insight.acknowledge`
- `ai.insight.dismiss`
- `ai.insight.manage`

API ownership: `AiModule`

### 12.4 InventoryAlert

Purpose: AI or rules-generated alert for low stock, expiry, abnormal usage, or purchasing recommendation.

Fields:

- `id`
- `organizationId`
- `branchId`
- `ingredientId`
- `alertType`: `LOW_STOCK`, `OUT_OF_STOCK`, `EXPIRING_SOON`, `ABNORMAL_USAGE`, `PURCHASE_RECOMMENDED`
- `severity`: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- `message`
- `recommendedQuantity`
- `unitOfMeasure`
- `source`: `RULE`, `AI`
- `status`: `OPEN`, `ACKNOWLEDGED`, `RESOLVED`, `DISMISSED`

Validation:

- Must reference an ingredient.
- Open alerts should be deduplicated by branch, ingredient, and alert type.

Relationships:

- Belongs to `Ingredient` and `Branch`.
- May generate purchase order draft.

State transitions:

- `OPEN -> ACKNOWLEDGED`
- `ACKNOWLEDGED -> RESOLVED`
- `OPEN -> RESOLVED`
- `OPEN -> DISMISSED`

Events emitted:

- `inventory.alert.created.v1`
- `inventory.alert.resolved.v1`
- `inventory.alert.dismissed.v1`

Permissions:

- `inventory.alert.read`
- `inventory.alert.update`
- `inventory.purchase.create`

API ownership: `InventoryModule` with AI enrichment through `AiModule`

