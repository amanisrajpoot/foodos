import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../shared/providers/prisma/prisma.service';

@Injectable()
export class RestaurantService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Full Onboarding Pipeline ---

  async onboardFullRestaurant(data: {
    // Organization Data
    legalName: string;
    tradeName?: string;
    countryCode: string;
    defaultCurrency: string;
    defaultTimezone?: string;
    taxId?: string;

    // Restaurant Brand Data
    restaurantName: string;
    brandLogoUrl?: string;
    cuisineTypes?: string[];
    description?: string;
    primaryContactName?: string;
    primaryContactPhone?: string;
    primaryContactEmail?: string;

    // Branch Data
    branchName: string;
    branchCode?: string;
    branchType?: string; // DINE_IN, CLOUD_KITCHEN, TAKEAWAY, HYBRID
    phone?: string;
    email?: string;
    addressLine1?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;

    // Staff Invitation
    adminEmail?: string;
    adminName?: string;
  }) {
    const slug = data.legalName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Transactionally create all entities
    return this.prisma.$transaction(async (tx) => {
      // 1. Create Organization
      const org = await tx.organization.create({
        data: {
          legalName: data.legalName,
          tradeName: data.tradeName || data.legalName,
          slug: `${slug}-${Date.now().toString(36)}`,
          countryCode: data.countryCode || 'IN',
          defaultCurrency: data.defaultCurrency || 'INR',
          defaultTimezone: data.defaultTimezone || 'Asia/Kolkata',
          status: 'ACTIVE',
        },
      });

      // 2. Create Restaurant Brand Concept
      const restaurantSlug = data.restaurantName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const restaurant = await tx.restaurant.create({
        data: {
          organizationId: org.id,
          name: data.restaurantName,
          slug: restaurantSlug,
          brandLogoUrl: data.brandLogoUrl,
          cuisineTypes: data.cuisineTypes || ['MULTI_CUISINE'],
          description: data.description,
          primaryContactName: data.primaryContactName,
          primaryContactPhone: data.primaryContactPhone,
          primaryContactEmail: data.primaryContactEmail,
          status: 'ACTIVE',
        },
      });

      // 3. Create First Branch Location
      const branchCode = data.branchCode || 'BR-001';
      const branch = await tx.branch.create({
        data: {
          organizationId: org.id,
          restaurantId: restaurant.id,
          name: data.branchName || `${data.restaurantName} Main`,
          branchCode,
          branchType: data.branchType || 'HYBRID',
          status: 'SETUP',
          phone: data.phone || data.primaryContactPhone,
          email: data.email || data.primaryContactEmail,
          addressLine1: data.addressLine1,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          countryCode: data.countryCode || 'IN',
          latitude: data.latitude,
          longitude: data.longitude,
          timezone: data.defaultTimezone || 'Asia/Kolkata',
        },
      });

      // 4. Create Default Departments
      const departmentTypes = [
        { name: 'Kitchen', type: 'KITCHEN' },
        { name: 'Service', type: 'SERVICE' },
        { name: 'Cashier', type: 'CASHIER' },
        { name: 'Delivery', type: 'DELIVERY' },
      ];
      for (const dept of departmentTypes) {
        await tx.department.create({
          data: {
            organizationId: org.id,
            branchId: branch.id,
            name: dept.name,
            departmentType: dept.type,
            status: 'ACTIVE',
          },
        });
      }

      // 5. Create Default Branch Operational Settings
      await tx.branchSettings.create({
        data: {
          organizationId: org.id,
          branchId: branch.id,
          acceptsDineIn: true,
          acceptsTakeaway: true,
          acceptsDelivery: true,
          autoAcceptOrders: false,
          printKitchenTickets: true,
          taxInclusivePricing: false,
          defaultPreparationMinutes: 15,
        },
      });

      // 6. Create Template Dining Tables
      const tables = [
        { label: 'T-01', section: 'Main Hall', capacity: 2 },
        { label: 'T-02', section: 'Main Hall', capacity: 4 },
        { label: 'T-03', section: 'Main Hall', capacity: 4 },
        { label: 'T-04', section: 'VIP Lounge', capacity: 6 },
      ];
      for (const t of tables) {
        await tx.diningTable.create({
          data: {
            organizationId: org.id,
            branchId: branch.id,
            label: t.label,
            section: t.section,
            capacity: t.capacity,
            qrCode: `QR-${branch.id}-${t.label}`,
            status: 'AVAILABLE',
          },
        });
      }

      return {
        organization: org,
        restaurant,
        branch,
      };
    });
  }

  async validateAndActivateBranch(branchId: string) {
    const branch = await this.prisma.branch.findUnique({
      where: { id: branchId },
      include: { settings: true },
    });

    if (!branch) throw new NotFoundException(`Branch ${branchId} not found`);

    if (!branch.addressLine1 || !branch.phone) {
      throw new BadRequestException('Branch requires address and contact phone to activate.');
    }

    return this.prisma.branch.update({
      where: { id: branchId },
      data: { status: 'ACTIVE' },
    });
  }

  // --- Organization ---

  async createOrganization(data: any) {
    return this.prisma.organization.create({ data });
  }

  async getOrganization(id: string) {
    return this.prisma.organization.findUnique({
      where: { id },
      include: { restaurants: true, branches: true },
    });
  }

  // --- Restaurant Brands ---

  async createRestaurant(data: any) {
    return this.prisma.restaurant.create({ data });
  }

  async getRestaurants(organizationId: string) {
    return this.prisma.restaurant.findMany({
      where: { organizationId },
      include: { branches: true },
    });
  }

  async getRestaurantDetail(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: { branches: { include: { settings: true } }, menus: true },
    });
    if (!restaurant) throw new NotFoundException(`Restaurant ${id} not found`);
    return restaurant;
  }

  async updateRestaurant(id: string, data: any) {
    return this.prisma.restaurant.update({
      where: { id },
      data,
    });
  }

  // --- Branch Locations ---

  async createBranch(data: any) {
    return this.prisma.branch.create({ data });
  }

  async getBranches(restaurantId: string) {
    return this.prisma.branch.findMany({
      where: { restaurantId },
      include: { settings: true, diningTables: true },
    });
  }

  async getBranchDetail(branchId: string) {
    const branch = await this.prisma.branch.findUnique({
      where: { id: branchId },
      include: {
        restaurant: true,
        settings: true,
        departments: true,
        diningTables: true,
      },
    });
    if (!branch) throw new NotFoundException(`Branch ${branchId} not found`);
    return branch;
  }

  async updateBranch(branchId: string, data: any) {
    return this.prisma.branch.update({
      where: { id: branchId },
      data,
    });
  }

  // --- Departments & Floorplan Tables ---

  async createDepartment(data: any) {
    return this.prisma.department.create({ data });
  }

  async getBranchTables(branchId: string) {
    return this.prisma.diningTable.findMany({
      where: { branchId },
      orderBy: { label: 'asc' },
    });
  }

  async manageDiningTables(branchId: string, organizationId: string, tables: any[]) {
    const results: any[] = [];
    for (const t of tables) {
      if (t.id) {
        const updated = await this.prisma.diningTable.update({
          where: { id: t.id },
          data: { label: t.label, section: t.section, capacity: t.capacity, status: t.status },
        });
        results.push(updated);
      } else {
        const created = await this.prisma.diningTable.create({
          data: {
            organizationId,
            branchId,
            label: t.label,
            section: t.section || 'Main Area',
            capacity: t.capacity || 4,
            qrCode: `QR-${branchId}-${t.label}`,
            status: 'AVAILABLE',
          },
        });
        results.push(created);
      }
    }
    return results;
  }

  // --- Settings ---

  async updateBranchSettings(branchId: string, data: any) {
    return this.prisma.branchSettings.upsert({
      where: { branchId },
      update: data,
      create: { ...data, branchId, organizationId: data.organizationId },
    });
  }
}
