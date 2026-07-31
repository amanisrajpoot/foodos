import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding system permissions and roles...');
  
  // Seed Permissions
  const permissions = [
    // Identity
    { key: 'identity.membership.read', domain: 'identity', resource: 'membership', action: 'read', description: 'Read memberships' },
    { key: 'identity.membership.invite', domain: 'identity', resource: 'membership', action: 'invite', description: 'Invite users' },
    { key: 'identity.role.manage', domain: 'identity', resource: 'role', action: 'manage', description: 'Manage roles' },
    
    // Restaurant
    { key: 'restaurant.organization.manage', domain: 'restaurant', resource: 'organization', action: 'manage', description: 'Manage org settings' },
    { key: 'restaurant.branch.read', domain: 'restaurant', resource: 'branch', action: 'read', description: 'Read branches' },
    { key: 'restaurant.branch.manage', domain: 'restaurant', resource: 'branch', action: 'manage', description: 'Manage branch settings' },
    
    // Platform
    { key: 'platform.audit.read', domain: 'platform', resource: 'audit', action: 'read', description: 'View audit logs' }
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { key: perm.key },
      update: {},
      create: perm
    });
  }
  
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
