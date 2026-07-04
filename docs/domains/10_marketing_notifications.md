# Marketing and Notifications Domain

Generated from FoodOS_Business_Objects_Entity_Bible_v1.md.
Use this file as focused context; keep the master entity bible as the full archive.

Load with:
- 00_PROJECT_CONTEXT.md
- domains/08_crm.md
- domains/11_integrations.md

## 10. Marketing and Notifications Domain

### 10.1 Coupon

Purpose: Discount instrument for orders and campaigns. V1 can be basic percentage or fixed amount only.

Fields:

- `id`
- `organizationId`
- `restaurantId`
- `code`
- `name`
- `discountType`: `PERCENTAGE`, `FIXED_AMOUNT`, `FREE_DELIVERY`
- `discountValue`
- `maxDiscountMinor`
- `minimumOrderValueMinor`
- `usageLimitTotal`
- `usageLimitPerCustomer`
- `startsAt`
- `endsAt`
- `status`: `DRAFT`, `ACTIVE`, `PAUSED`, `EXPIRED`, `ARCHIVED`

Validation:

- Code is unique per organization.
- Discount value must be positive.
- Date range must be valid.
- Percentage discount cannot exceed 100.

Relationships:

- Used by orders.
- Can belong to campaign.

State transitions:

- `DRAFT -> ACTIVE`
- `ACTIVE -> PAUSED`
- `PAUSED -> ACTIVE`
- `ACTIVE -> EXPIRED`
- `ACTIVE -> ARCHIVED`

Events emitted:

- `marketing.coupon.created.v1`
- `marketing.coupon.activated.v1`
- `marketing.coupon.paused.v1`
- `marketing.coupon.redeemed.v1`

Permissions:

- `marketing.coupon.read`
- `marketing.coupon.create`
- `marketing.coupon.update`
- `marketing.coupon.delete`

API ownership: `MarketingModule`

### 10.2 NotificationTemplate

Purpose: Reusable message template for WhatsApp, SMS, email, and in-app notifications.

Fields:

- `id`
- `organizationId`
- `name`
- `channel`: `WHATSAPP`, `SMS`, `EMAIL`, `IN_APP`
- `templateKey`
- `subject`
- `body`
- `variables`
- `providerTemplateId`
- `status`: `DRAFT`, `PENDING_APPROVAL`, `ACTIVE`, `REJECTED`, `ARCHIVED`

Validation:

- Template key is unique per organization and channel.
- Provider-approved channels must store provider template ID.
- Variables must be declared and validated at send time.

Relationships:

- Used by `NotificationMessage`.
- Linked to provider config.

State transitions:

- `DRAFT -> PENDING_APPROVAL`
- `PENDING_APPROVAL -> ACTIVE`
- `PENDING_APPROVAL -> REJECTED`
- `ACTIVE -> ARCHIVED`

Events emitted:

- `notifications.template.created.v1`
- `notifications.template.approved.v1`
- `notifications.template.rejected.v1`

Permissions:

- `marketing.notification_template.read`
- `marketing.notification_template.create`
- `marketing.notification_template.update`
- `marketing.notification_template.delete`

API ownership: `NotificationsModule`

### 10.3 NotificationMessage

Purpose: Tracks an individual outbound notification attempt.

Fields:

- `id`
- `organizationId`
- `templateId`
- `recipientType`: `CUSTOMER`, `USER`, `EMPLOYEE`, `EXTERNAL`
- `recipientId`
- `recipientAddress`
- `channel`: `WHATSAPP`, `SMS`, `EMAIL`, `IN_APP`
- `status`: `QUEUED`, `SENT`, `DELIVERED`, `FAILED`, `CANCELLED`
- `provider`
- `providerMessageId`
- `payload`
- `failureReason`
- `queuedAt`
- `sentAt`
- `deliveredAt`

Validation:

- Recipient address is required.
- Channel must have active provider configuration.
- Failed messages may be retried with idempotency key.

Relationships:

- Optionally belongs to `NotificationTemplate`.
- Can reference order, payment, delivery, customer, or campaign.

State transitions:

- `QUEUED -> SENT`
- `SENT -> DELIVERED`
- `QUEUED -> FAILED`
- `SENT -> FAILED`
- `QUEUED -> CANCELLED`

Events emitted:

- `notifications.message.queued.v1`
- `notifications.message.sent.v1`
- `notifications.message.delivered.v1`
- `notifications.message.failed.v1`

Permissions:

- `marketing.notification.read`
- `marketing.notification.send`

API ownership: `NotificationsModule`

