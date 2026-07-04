# Integrations Domain

Generated from FoodOS_Business_Objects_Entity_Bible_v1.md.
Use this file as focused context; keep the master entity bible as the full archive.

Load with:
- 00_PROJECT_CONTEXT.md
- 03_SHARED_MODELING_RULES.md

## 11. Integrations Domain

### 11.1 IntegrationProviderConfig

Purpose: Stores organization or branch configuration for external providers without leaking vendor logic into business domains.

Fields:

- `id`
- `organizationId`
- `branchId`
- `providerType`: `PAYMENT`, `DELIVERY`, `MARKETPLACE`, `WHATSAPP`, `SMS`, `EMAIL`, `MAPS`, `AI`, `STORAGE`
- `providerKey`
- `displayName`
- `status`: `DRAFT`, `ACTIVE`, `DISABLED`, `ERROR`
- `credentialsRef`
- `configJson`
- `webhookSecretRef`
- `lastHealthCheckAt`

Validation:

- Provider key must match a registered adapter.
- Secrets must not be stored in plain text in the table.
- Only one default active provider per provider type and branch unless multi-provider routing is configured.

Relationships:

- Referenced by payments, delivery assignments, notifications, storage, and AI gateway calls.

State transitions:

- `DRAFT -> ACTIVE`
- `ACTIVE -> DISABLED`
- `DISABLED -> ACTIVE`
- `ACTIVE -> ERROR`
- `ERROR -> ACTIVE`

Events emitted:

- `integrations.provider_config.created.v1`
- `integrations.provider_config.activated.v1`
- `integrations.provider_config.disabled.v1`
- `integrations.provider_config.health_failed.v1`

Permissions:

- `integrations.provider.read`
- `integrations.provider.create`
- `integrations.provider.update`
- `integrations.provider.delete`
- `integrations.provider.manage_secrets`

API ownership: `IntegrationsModule`

### 11.2 WebhookEvent

Purpose: Immutable record of inbound provider webhook payloads for idempotency, audit, and async processing.

Fields:

- `id`
- `organizationId`
- `providerConfigId`
- `providerType`
- `providerKey`
- `eventKey`
- `externalEventId`
- `status`: `RECEIVED`, `VERIFIED`, `PROCESSING`, `PROCESSED`, `FAILED`, `IGNORED`
- `headersJson`
- `payloadJson`
- `receivedAt`
- `processedAt`
- `failureReason`

Validation:

- `externalEventId` plus provider should be idempotent when provider supplies it.
- Payload should be size-limited.
- Signature verification must happen before business effects.

Relationships:

- Belongs to `IntegrationProviderConfig`.
- May create or update payments, deliveries, notifications, marketplace orders.

State transitions:

- `RECEIVED -> VERIFIED`
- `VERIFIED -> PROCESSING`
- `PROCESSING -> PROCESSED`
- Any processing state -> `FAILED`
- `VERIFIED -> IGNORED`

Events emitted:

- `integrations.webhook.received.v1`
- `integrations.webhook.processed.v1`
- `integrations.webhook.failed.v1`

Permissions:

- `integrations.webhook.read`
- `integrations.webhook.replay`

API ownership: `IntegrationsModule`

### 11.3 ExternalReference

Purpose: Generic mapping between FoodOS entity IDs and external provider IDs.

Fields:

- `id`
- `organizationId`
- `providerType`
- `providerKey`
- `entityType`
- `entityId`
- `externalId`
- `externalUrl`
- `metadata`

Validation:

- `(providerKey, entityType, entityId)` should be unique unless multiple external objects are expected.
- External ID is required.

Relationships:

- References any supported FoodOS entity by typed ID.

State transitions:

- No lifecycle state; records can be archived through soft delete.

Events emitted:

- `integrations.external_reference.created.v1`
- `integrations.external_reference.updated.v1`

Permissions:

- `integrations.reference.read`
- `integrations.reference.update`

API ownership: `IntegrationsModule`

