# Finance Domain

Generated from FoodOS_Business_Objects_Entity_Bible_v1.md.
Use this file as focused context; keep the master entity bible as the full archive.

Load with:
- 00_PROJECT_CONTEXT.md
- domains/06_orders_kitchen_pos.md
- domains/11_integrations.md

## Finance Core

### 7.5 Payment

Purpose: Records money collected or attempted for an order.

Fields:

- `id`
- `organizationId`
- `branchId`
- `orderId`
- `paymentNumber`
- `provider`: `CASH`, `RAZORPAY`, `CASHFREE`, `STRIPE`, `PHONEPE`, `OTHER`
- `method`: `CASH`, `CARD`, `UPI`, `WALLET`, `BANK_TRANSFER`, `ONLINE`
- `status`: `PENDING`, `AUTHORIZED`, `CAPTURED`, `FAILED`, `CANCELLED`, `REFUNDED`, `PARTIALLY_REFUNDED`
- `amountMinor`
- `currency`
- `providerPaymentId`
- `providerOrderId`
- `failureCode`
- `failureMessage`
- `paidAt`

Validation:

- Amount must be greater than zero.
- Provider-specific fields are stored as external references, not used directly by business logic.
- Captured payments cannot be deleted.
- Refund cannot exceed captured amount.

Relationships:

- Belongs to `Order`.
- Has many refund records when refunds are split.
- References integration provider config.

State transitions:

- `PENDING -> AUTHORIZED`
- `AUTHORIZED -> CAPTURED`
- `PENDING -> FAILED`
- `AUTHORIZED -> CANCELLED`
- `CAPTURED -> PARTIALLY_REFUNDED`
- `CAPTURED -> REFUNDED`
- `PARTIALLY_REFUNDED -> REFUNDED`

Events emitted:

- `payments.payment.initiated.v1`
- `payments.payment.authorized.v1`
- `payments.payment.captured.v1`
- `payments.payment.failed.v1`
- `payments.payment.refunded.v1`

Permissions:

- `payments.payment.read`
- `payments.payment.create`
- `payments.payment.refund`
- `payments.payment.export`

API ownership: `PaymentsModule`

### 7.6 Invoice

Purpose: Legal and financial document generated for a completed or paid order.

Fields:

- `id`
- `organizationId`
- `branchId`
- `orderId`
- `invoiceNumber`
- `status`: `DRAFT`, `ISSUED`, `VOIDED`, `CREDITED`
- `customerName`
- `customerGstin`
- `billingAddress`
- `subtotalMinor`
- `discountMinor`
- `taxMinor`
- `totalMinor`
- `currency`
- `issuedAt`
- `voidedAt`
- `pdfUrl`

Validation:

- Invoice number is unique per branch and financial year.
- Issued invoice must be immutable except legal correction workflows.
- GST fields must validate when present.
- Voiding requires reason and permission.

Relationships:

- Belongs to `Order`.
- Has invoice line snapshots.
- Referenced by finance reports.

State transitions:

- `DRAFT -> ISSUED`
- `ISSUED -> VOIDED`
- `ISSUED -> CREDITED`

Events emitted:

- `finance.invoice.issued.v1`
- `finance.invoice.voided.v1`
- `finance.invoice.credited.v1`

Permissions:

- `finance.invoice.read`
- `finance.invoice.issue`
- `finance.invoice.void`
- `finance.invoice.export`

API ownership: `FinanceModule`

### 7.7 TaxCategory

Purpose: Defines tax rules applicable to menu items, charges, and invoices.

Fields:

- `id`
- `organizationId`
- `name`
- `countryCode`
- `taxType`: `GST`, `VAT`, `SALES_TAX`, `SERVICE_TAX`, `OTHER`
- `ratePercent`
- `isInclusive`
- `status`: `ACTIVE`, `INACTIVE`

Validation:

- Rate must be zero or positive.
- Active tax category must have valid country and tax type.

Relationships:

- Referenced by menu items and invoice lines.

State transitions:

- `ACTIVE -> INACTIVE`
- `INACTIVE -> ACTIVE`

Events emitted:

- `finance.tax_category.created.v1`
- `finance.tax_category.updated.v1`
- `finance.tax_category.deactivated.v1`

Permissions:

- `finance.tax.read`
- `finance.tax.create`
- `finance.tax.update`
- `finance.tax.delete`

API ownership: `FinanceModule`

