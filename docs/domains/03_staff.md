# Staff Domain

Generated from FoodOS_Business_Objects_Entity_Bible_v1.md.
Use this file as focused context; keep the master entity bible as the full archive.

Load with:
- 00_PROJECT_CONTEXT.md
- domains/01_identity.md
- domains/02_restaurant.md

## 4. Staff Domain

### 4.1 Employee

Purpose: Represents a staff member working for a restaurant or branch. May or may not have a login user.

Fields:

- `id`
- `organizationId`
- `restaurantId`
- `branchId`
- `userId`
- `employeeCode`
- `fullName`
- `phone`
- `email`
- `jobTitle`
- `employmentType`: `FULL_TIME`, `PART_TIME`, `CONTRACT`, `TEMPORARY`
- `status`: `ACTIVE`, `ON_LEAVE`, `SUSPENDED`, `EXITED`
- `joinedAt`
- `exitedAt`

Validation:

- `employeeCode` is unique per organization.
- Active employees require name, phone, branch, and job title.
- `exitedAt` is required when status is `EXITED`.

Relationships:

- Optionally belongs to `User`.
- Belongs to `Branch`.
- Can be assigned to orders, kitchen tickets, delivery tasks, POS shifts.

State transitions:

- `ACTIVE -> ON_LEAVE`
- `ON_LEAVE -> ACTIVE`
- `ACTIVE -> SUSPENDED`
- `SUSPENDED -> ACTIVE`
- `ACTIVE -> EXITED`

Events emitted:

- `staff.employee.created.v1`
- `staff.employee.updated.v1`
- `staff.employee.exited.v1`

Permissions:

- `staff.employee.read`
- `staff.employee.create`
- `staff.employee.update`
- `staff.employee.delete`

API ownership: `StaffModule`

