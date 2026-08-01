import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { randomUUID } from 'crypto';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/foodos';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting DB wipe and seed process...');

  // 1. WIPE EXISTING DATA
  console.log('Wiping existing data (in reverse dependency order)...');
  
  // Wipe Analytics & AI
  await prisma.aIInsight.deleteMany();
  await prisma.dailyBusinessSummary.deleteMany();
  await prisma.kpiSnapshot.deleteMany();
  
  // Wipe Orders & Payments
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.review.deleteMany();
  await prisma.kitchenTicketItem.deleteMany();
  await prisma.kitchenTicket.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  
  // Wipe Customers
  await prisma.customer.deleteMany();
  
  // Wipe Menus
  await prisma.menuItemPlacement.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.taxCategory.deleteMany();
  
  // Wipe Staff & Branches
  await prisma.branchSettings.deleteMany();
  await prisma.diningTable.deleteMany();
  await prisma.department.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.branch.deleteMany();
  
  // Wipe Core Org
  await prisma.restaurant.deleteMany();
  await prisma.membershipRole.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.organization.deleteMany();
  
  // Wipe users
  await prisma.user.deleteMany(); 
  
  console.log('Data wipe complete.');

  // 2. SEED SYSTEM PERMISSIONS (From original script)
  console.log('Seeding system permissions and roles...');
  const permissions = [
    { key: 'identity.membership.read', domain: 'identity', resource: 'membership', action: 'read', description: 'Read memberships' },
    { key: 'identity.membership.invite', domain: 'identity', resource: 'membership', action: 'invite', description: 'Invite users' },
    { key: 'identity.role.manage', domain: 'identity', resource: 'role', action: 'manage', description: 'Manage roles' },
    { key: 'restaurant.organization.manage', domain: 'restaurant', resource: 'organization', action: 'manage', description: 'Manage org settings' },
    { key: 'restaurant.branch.read', domain: 'restaurant', resource: 'branch', action: 'read', description: 'Read branches' },
    { key: 'restaurant.branch.manage', domain: 'restaurant', resource: 'branch', action: 'manage', description: 'Manage branch settings' },
    { key: 'platform.audit.read', domain: 'platform', resource: 'audit', action: 'read', description: 'View audit logs' }
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { key: perm.key },
      update: {},
      create: perm
    });
  }

  // 3. SEED CLEAN TENANT DATA
  console.log('Seeding clean tenant data...');

  const orgId = randomUUID();
  const userId = randomUUID();
  const restaurantId = randomUUID();
  const branchDineInId = randomUUID();
  const branchDeliveryId = randomUUID();
  const taxCategoryId = randomUUID();
  const menuId = randomUUID();
  
  // Create User
  await prisma.user.create({
    data: {
      id: userId,
      name: 'Admin User',
      email: 'admin@foodos.test',
      status: 'ACTIVE',
      emailVerified: true
    }
  });

  // Create Organization
  await prisma.organization.create({
    data: {
      id: orgId,
      legalName: 'Acme Foods Inc.',
      slug: 'acme-foods',
      countryCode: 'IN',
      defaultCurrency: 'INR',
      status: 'ACTIVE',
      metadata: { seeded: true }
    }
  });

  // Create Membership
  await prisma.membership.create({
    data: {
      organizationId: orgId,
      userId: userId,
      scope: 'ORGANIZATION',
      status: 'ACTIVE'
    }
  });

  // Create Restaurant
  await prisma.restaurant.create({
    data: {
      id: restaurantId,
      organizationId: orgId,
      name: 'Burger Bliss',
      slug: 'burger-bliss',
      cuisineTypes: ['American', 'Fast Food'],
      status: 'ACTIVE'
    }
  });

  // Create Branches
  await prisma.branch.create({
    data: {
      id: branchDineInId,
      organizationId: orgId,
      restaurantId: restaurantId,
      name: 'Burger Bliss - Downtown (Dine-In)',
      branchCode: 'BB-DT',
      branchType: 'DINE_IN',
      status: 'ACTIVE',
      city: 'Mumbai',
      settings: {
        create: {
          organizationId: orgId,
          acceptsDineIn: true,
          acceptsTakeaway: true,
          acceptsDelivery: false
        }
      }
    }
  });

  await prisma.branch.create({
    data: {
      id: branchDeliveryId,
      organizationId: orgId,
      restaurantId: restaurantId,
      name: 'Burger Bliss - Cloud (Delivery)',
      branchCode: 'BB-CLOUD',
      branchType: 'CLOUD_KITCHEN',
      status: 'ACTIVE',
      city: 'Mumbai',
      settings: {
        create: {
          organizationId: orgId,
          acceptsDineIn: false,
          acceptsTakeaway: true,
          acceptsDelivery: true
        }
      }
    }
  });

  // Create Tax Category
  await prisma.taxCategory.create({
    data: {
      id: taxCategoryId,
      organizationId: orgId,
      name: 'Standard GST 5%',
      countryCode: 'IN',
      taxType: 'GST',
      ratePercent: 5.0,
      isInclusive: false
    }
  });

  // Create Menu & Categories
  await prisma.menu.create({
    data: {
      id: menuId,
      organizationId: orgId,
      restaurantId: restaurantId,
      name: 'Main Menu',
      menuType: 'ALL_DAY',
      status: 'ACTIVE'
    }
  });

  const categoryBurgersId = randomUUID();
  const categoryDrinksId = randomUUID();

  await prisma.menuCategory.createMany({
    data: [
      { id: categoryBurgersId, organizationId: orgId, menuId: menuId, name: 'Burgers', sortOrder: 1 },
      { id: categoryDrinksId, organizationId: orgId, menuId: menuId, name: 'Beverages', sortOrder: 2 }
    ]
  });

  // Create Menu Items
  const item1Id = randomUUID();
  const item2Id = randomUUID();

  await prisma.menuItem.createMany({
    data: [
      {
        id: item1Id,
        organizationId: orgId,
        restaurantId: restaurantId,
        name: 'Classic Cheeseburger',
        itemType: 'FOOD',
        dietaryType: 'NON_VEG',
        basePriceMinor: 25000, // 250.00 INR
        taxCategoryId: taxCategoryId,
        status: 'ACTIVE'
      },
      {
        id: item2Id,
        organizationId: orgId,
        restaurantId: restaurantId,
        name: 'French Fries',
        itemType: 'FOOD',
        dietaryType: 'VEG',
        basePriceMinor: 10000, // 100.00 INR
        taxCategoryId: taxCategoryId,
        status: 'ACTIVE'
      }
    ]
  });

  // Place Items in Categories
  await prisma.menuItemPlacement.createMany({
    data: [
      { organizationId: orgId, menuId: menuId, categoryId: categoryBurgersId, menuItemId: item1Id, visibleChannels: ['DINE_IN', 'DELIVERY'] },
      { organizationId: orgId, menuId: menuId, categoryId: categoryBurgersId, menuItemId: item2Id, visibleChannels: ['DINE_IN', 'DELIVERY'] }
    ]
  });

  // Mock Analytics Data
  await prisma.dailyBusinessSummary.create({
    data: {
      organizationId: orgId,
      restaurantId: restaurantId,
      branchId: branchDineInId,
      businessDate: new Date('2026-08-01T00:00:00Z'),
      salesTotalMinor: 5500000, // 55,000 INR
      orderCount: 120,
      summaryText: 'Busy day with high dine-in sales.',
      generatedBy: 'SYSTEM'
    }
  });

  console.log('Seeding complete!');
  console.log('--------------------------------------------------');
  console.log('TESTING VARIABLES:');
  console.log(`organizationId = ${orgId}`);
  console.log(`restaurantId   = ${restaurantId}`);
  console.log(`branchId       = ${branchDineInId}`);
  console.log('--------------------------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
