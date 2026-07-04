# Platform Sync and Audit Domain

Generated from FoodOS_Business_Objects_Entity_Bible_v1.md.
Use this file as focused context; keep the master entity bible as the full archive.

Load with:
- 00_PROJECT_CONTEXT.md
- 03_SHARED_MODELING_RULES.md
- 04_PERMISSIONS_AND_EVENTS.md

## 13. Platform Event and Sync Entities

### 13.1 DomainEventOutbox

Purpose: Reliable transactionally written event queue for async processing, integrations, analytics, and AI.

Fields:

- `id`
- `organizationId`
- `eventName`
- `aggregateType`
- `aggregateId`
- `payloadJson`
- `metadataJson`
- `status`: `PENDING`, `PUBLISHED`, `FAILED`, `DEAD_LETTER`
- `occurredAt`
- `publishedAt`
- `attemptCount`
- `lastError`

Validation:

- Written inside the same transaction as aggregate mutation.
- Payload must include event schema version.
- Events should be append-only.

Relationships:

- References source aggregate by type and ID.

State transitions:

- `PENDING -> PUBLISHED`
- `PENDING -> FAILED`
- `FAILED -> PENDING`
- `FAILED -> DEAD_LETTER`

Events emitted:

- This entity stores events rather than emitting business events itself.

Permissions:

- System only.
- Admin read for diagnostics.

API ownership: `PlatformModule`

### 13.2 AuditLog

Purpose: Immutable record of important user or system actions.

Fields:

- `id`
- `organizationId`
- `actorUserId`
- `actorType`: `USER`, `SYSTEM`, `PROVIDER`, `AI`
- `action`
- `entityType`
- `entityId`
- `beforeJson`
- `afterJson`
- `ipAddress`
- `userAgent`
- `occurredAt`

Validation:

- Immutable after creation.
- Sensitive fields must be redacted.
- High-risk actions must be audited.

Relationships:

- References user and target entity by typed ID.

State transitions:

- Immutable.

Events emitted:

- None normally.

Permissions:

- `platform.audit.read`
- `platform.audit.export`

API ownership: `PlatformModule`

### 13.3 OfflineSyncRecord

Purpose: Tracks offline client mutations and conflict resolution for POS, KDS, and branch operations.

Fields:

- `id`
- `organizationId`
- `branchId`
- `clientId`
- `deviceId`
- `entityType`
- `entityId`
- `operation`: `CREATE`, `UPDATE`, `DELETE`
- `clientVersion`
- `serverVersion`
- `payloadJson`
- `status`: `PENDING`, `APPLIED`, `CONFLICT`, `REJECTED`
- `conflictReason`
- `receivedAt`
- `appliedAt`

Validation:

- Idempotency key is required per offline mutation.
- Mutations must be scoped to the authenticated branch and device.
- Conflict resolution must not silently overwrite server state for financial records.

Relationships:

- References target entity by typed ID.
- Linked to device/session metadata.

State transitions:

- `PENDING -> APPLIED`
- `PENDING -> CONFLICT`
- `PENDING -> REJECTED`
- `CONFLICT -> APPLIED` after manual or policy resolution

Events emitted:

- `platform.offline_sync.applied.v1`
- `platform.offline_sync.conflict_detected.v1`
- `platform.offline_sync.rejected.v1`

Permissions:

- System authenticated device writes.
- `platform.sync.read` for diagnostics.

API ownership: `PlatformModule`

