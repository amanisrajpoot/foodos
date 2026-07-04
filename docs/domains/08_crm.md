# CRM Domain

Generated from FoodOS_Business_Objects_Entity_Bible_v1.md.
Use this file as focused context; keep the master entity bible as the full archive.

Load with:
- 00_PROJECT_CONTEXT.md
- domains/02_restaurant.md
- domains/06_orders_kitchen_pos.md

## 8. CRM Domain

### 8.1 Customer

Purpose: Represents a guest or buyer across dine-in, takeaway, delivery, POS, and future channels.

Fields:

- `id`
- `organizationId`
- `restaurantId`
- `fullName`
- `phone`
- `email`
- `dateOfBirth`
- `anniversaryDate`
- `tags`
- `marketingOptIn`
- `whatsappOptIn`
- `emailOptIn`
- `smsOptIn`
- `lifetimeSpendMinor`
- `orderCount`
- `lastOrderAt`
- `status`: `ACTIVE`, `BLOCKED`, `MERGED`, `DELETED`

Validation:

- At least one contact method is required unless anonymous POS customer.
- Phone is unique per organization when present.
- Marketing flags must respect consent records.

Relationships:

- Has many orders.
- Has many addresses.
- Has wallet transactions, memberships, reviews.

State transitions:

- `ACTIVE -> BLOCKED`
- `BLOCKED -> ACTIVE`
- `ACTIVE -> MERGED`
- `ACTIVE -> DELETED`

Events emitted:

- `crm.customer.created.v1`
- `crm.customer.updated.v1`
- `crm.customer.merged.v1`
- `crm.customer.blocked.v1`

Permissions:

- `crm.customer.read`
- `crm.customer.create`
- `crm.customer.update`
- `crm.customer.delete`
- `crm.customer.export`

API ownership: `CrmModule`

### 8.2 CustomerAddress

Purpose: Delivery or billing address for a customer.

Fields:

- `id`
- `organizationId`
- `customerId`
- `label`
- `addressLine1`
- `addressLine2`
- `city`
- `state`
- `postalCode`
- `countryCode`
- `latitude`
- `longitude`
- `deliveryInstructions`
- `isDefault`
- `status`: `ACTIVE`, `ARCHIVED`

Validation:

- Address line, city, country, and postal code are required for delivery.
- Only one default active address per customer.
- Latitude and longitude must be valid when present.

Relationships:

- Belongs to `Customer`.
- Referenced by delivery orders.

State transitions:

- `ACTIVE -> ARCHIVED`
- `ARCHIVED -> ACTIVE`

Events emitted:

- `crm.customer_address.created.v1`
- `crm.customer_address.updated.v1`
- `crm.customer_address.archived.v1`

Permissions:

- `crm.customer.read`
- `crm.customer.update`

API ownership: `CrmModule`

### 8.3 Review

Purpose: Captures customer feedback for an order, item, branch, or delivery experience.

Fields:

- `id`
- `organizationId`
- `restaurantId`
- `branchId`
- `customerId`
- `orderId`
- `rating`
- `comment`
- `reviewSource`: `IN_APP`, `GOOGLE`, `ZOMATO`, `SWIGGY`, `MANUAL`
- `status`: `PENDING`, `PUBLISHED`, `HIDDEN`, `FLAGGED`
- `submittedAt`

Validation:

- Rating must be between 1 and 5.
- One first-party review per customer per order unless update workflow is supported.

Relationships:

- Belongs to `Customer`.
- Optionally belongs to `Order` and `Branch`.

State transitions:

- `PENDING -> PUBLISHED`
- `PENDING -> HIDDEN`
- `PUBLISHED -> FLAGGED`
- `FLAGGED -> HIDDEN`
- `FLAGGED -> PUBLISHED`

Events emitted:

- `crm.review.submitted.v1`
- `crm.review.published.v1`
- `crm.review.flagged.v1`

Permissions:

- `crm.review.read`
- `crm.review.moderate`
- `crm.review.export`

API ownership: `CrmModule`

### 8.4 WalletTransaction

Purpose: Records customer wallet credits and debits. V1 optional unless wallet is enabled.

Fields:

- `id`
- `organizationId`
- `customerId`
- `transactionType`: `CREDIT`, `DEBIT`, `REFUND`, `ADJUSTMENT`, `EXPIRY`
- `amountMinor`
- `currency`
- `balanceAfterMinor`
- `referenceType`
- `referenceId`
- `reason`

Validation:

- Amount must be greater than zero.
- Wallet balance cannot go negative unless explicitly configured.
- Immutable after creation.

Relationships:

- Belongs to `Customer`.
- Can reference order, payment, refund, campaign, or adjustment.

State transitions:

- Immutable.

Events emitted:

- `crm.wallet_transaction.recorded.v1`

Permissions:

- `crm.wallet.read`
- `crm.wallet.adjust`

API ownership: `CrmModule`

