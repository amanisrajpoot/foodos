# Identity Domain

Generated from FoodOS_Business_Objects_Entity_Bible_v1.md.
Use this file as focused context; keep the master entity bible as the full archive.

Load with:
- 00_PROJECT_CONTEXT.md
- 03_SHARED_MODELING_RULES.md
- 04_PERMISSIONS_AND_EVENTS.md

## 2. Identity Domain

### 2.1 User

Purpose: Represents a human account that can authenticate and act inside one or more organizations.

Fields:

- `id`
- `email`
- `phone`
- `fullName`
- `displayName`
- `avatarUrl`
- `authProviderUserId`
- `status`: `INVITED`, `ACTIVE`, `SUSPENDED`, `DEACTIVATED`
- `lastLoginAt`
- `preferredLocale`
- `metadata`

Validation:

- At least one of `email` or `phone` is required.
- `email` must be unique when present.
- `phone` must be unique per country code when present.
- `status` controls access; suspended and deactivated users cannot create sessions.

Relationships:

- Has many `Membership`.
- May be linked to `Employee`.
- Creates and updates many operational records.

State transitions:

- `INVITED -> ACTIVE`
- `ACTIVE -> SUSPENDED`
- `SUSPENDED -> ACTIVE`
- `ACTIVE -> DEACTIVATED`

Events emitted:

- `identity.user.invited.v1`
- `identity.user.activated.v1`
- `identity.user.suspended.v1`
- `identity.user.deactivated.v1`

Permissions:

- Self profile read/update.
- Organization admins can invite, suspend, and deactivate users.

API ownership: `IdentityModule`

### 2.2 Membership

Purpose: Connects a user to an organization, restaurant, or branch with one or more roles.

Fields:

- `id`
- `organizationId`
- `userId`
- `restaurantId`
- `branchId`
- `scope`: `ORGANIZATION`, `RESTAURANT`, `BRANCH`
- `status`: `INVITED`, `ACTIVE`, `SUSPENDED`, `REMOVED`
- `invitedByUserId`
- `invitedAt`
- `acceptedAt`

Validation:

- `organizationId` and `userId` are required.
- `restaurantId` is required for restaurant scope.
- `branchId` is required for branch scope.
- A user cannot have duplicate active memberships for the same scope.

Relationships:

- Belongs to `User`.
- Belongs to `Organization`.
- Optionally belongs to `Restaurant` and `Branch`.
- Has many role assignments.

State transitions:

- `INVITED -> ACTIVE`
- `ACTIVE -> SUSPENDED`
- `SUSPENDED -> ACTIVE`
- `ACTIVE -> REMOVED`

Events emitted:

- `identity.membership.invited.v1`
- `identity.membership.accepted.v1`
- `identity.membership.suspended.v1`
- `identity.membership.removed.v1`

Permissions:

- `identity.membership.read`
- `identity.membership.invite`
- `identity.membership.update`
- `identity.membership.remove`

API ownership: `IdentityModule`

### 2.3 Role

Purpose: Defines a named bundle of permissions for a tenant.

Fields:

- `id`
- `organizationId`
- `name`
- `description`
- `isSystemRole`
- `isDefault`
- `status`: `ACTIVE`, `ARCHIVED`

Validation:

- `name` is unique per organization.
- System roles cannot be deleted.
- A role cannot be archived while assigned to active memberships unless reassigned.

Relationships:

- Has many `RolePermission`.
- Has many `MembershipRole`.

State transitions:

- `ACTIVE -> ARCHIVED`
- `ARCHIVED -> ACTIVE`

Events emitted:

- `identity.role.created.v1`
- `identity.role.updated.v1`
- `identity.role.archived.v1`

Permissions:

- `identity.role.read`
- `identity.role.create`
- `identity.role.update`
- `identity.role.delete`
- `identity.role.manage`

API ownership: `IdentityModule`

### 2.4 Permission

Purpose: Canonical permission key used by RBAC checks.

Fields:

- `id`
- `key`
- `domain`
- `resource`
- `action`
- `description`
- `isSystemPermission`

Validation:

- `key` is globally unique.
- Application code should treat permissions as seeded immutable records.

Relationships:

- Has many `RolePermission`.

State transitions:

- Usually immutable after seed.

Events emitted:

- None during normal product use.

Permissions:

- Readable by organization admins.
- Managed only by system operators or migrations.

API ownership: `IdentityModule`

