# FoodOS Provider Interfaces

Generated from FoodOS_Business_Objects_Entity_Bible_v1.md.
Use this file as focused context; keep the master entity bible as the full archive.

Load with:
- 00_PROJECT_CONTEXT.md
- domains/11_integrations.md

## 14. Provider Interfaces

Business domains should depend on interfaces, not vendors.

### 14.1 PaymentProvider

Methods:

- `createPaymentIntent(input)`
- `capturePayment(input)`
- `refundPayment(input)`
- `verifyWebhook(input)`
- `getPaymentStatus(input)`

Business objects affected:

- `Payment`
- `Order`
- `Invoice`
- `WebhookEvent`
- `ExternalReference`

Initial providers:

- Cash
- Razorpay
- Cashfree
- Stripe
- PhonePe

### 14.2 DeliveryProvider

Methods:

- `quoteDelivery(input)`
- `createDeliveryTask(input)`
- `cancelDeliveryTask(input)`
- `trackDelivery(input)`
- `verifyWebhook(input)`

Business objects affected:

- `DeliveryAssignment`
- `DeliveryEvent`
- `Order`
- `WebhookEvent`
- `ExternalReference`

Initial providers:

- Local Fleet
- Porter
- Borzo
- Uber
- Shadowfax

### 14.3 NotificationProvider

Methods:

- `sendMessage(input)`
- `renderTemplate(input)`
- `verifyWebhook(input)`
- `getDeliveryStatus(input)`

Business objects affected:

- `NotificationTemplate`
- `NotificationMessage`
- `Customer`
- `Order`

Initial providers:

- WhatsApp provider
- SMS provider
- Email provider

### 14.4 MapsProvider

Methods:

- `geocode(input)`
- `reverseGeocode(input)`
- `calculateDistance(input)`
- `calculateEta(input)`

Business objects affected:

- `Branch`
- `CustomerAddress`
- `DeliveryAssignment`

