import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/providers/prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  // Menu
  async createMenu(data: any) {
    return this.prisma.menu.create({ data });
  }
  async getMenus(restaurantId: string) {
    return this.prisma.menu.findMany({ where: { restaurantId } });
  }
  async getMenu(id: string) {
    return this.prisma.menu.findUnique({
      where: { id },
      include: {
        categories: {
          include: { placements: { include: { menuItem: true } } },
        },
      },
    });
  }
  async updateMenu(id: string, data: any) {
    return this.prisma.menu.update({ where: { id }, data });
  }
  async deleteMenu(id: string) {
    return this.prisma.menu.delete({ where: { id } });
  }

  // MenuCategory
  async createCategory(data: any) {
    return this.prisma.menuCategory.create({ data });
  }
  async getCategories(menuId: string) {
    return this.prisma.menuCategory.findMany({ where: { menuId } });
  }
  async updateCategory(id: string, data: any) {
    return this.prisma.menuCategory.update({ where: { id }, data });
  }
  async deleteCategory(id: string) {
    return this.prisma.menuCategory.delete({ where: { id } });
  }

  // MenuItem
  async createMenuItem(data: any) {
    return this.prisma.menuItem.create({ data });
  }
  async getMenuItems(restaurantId: string) {
    return this.prisma.menuItem.findMany({ where: { restaurantId } });
  }
  async getMenuItem(id: string) {
    return this.prisma.menuItem.findUnique({
      where: { id },
      include: {
        modifierGroups: { include: { options: true } },
        priceRules: true,
        availability: true,
      },
    });
  }
  async updateMenuItem(id: string, data: any) {
    return this.prisma.menuItem.update({ where: { id }, data });
  }
  async deleteMenuItem(id: string) {
    return this.prisma.menuItem.delete({ where: { id } });
  }

  // MenuItemPlacement
  async createPlacement(data: any) {
    return this.prisma.menuItemPlacement.create({ data });
  }
  async updatePlacement(id: string, data: any) {
    return this.prisma.menuItemPlacement.update({ where: { id }, data });
  }
  async deletePlacement(id: string) {
    return this.prisma.menuItemPlacement.delete({ where: { id } });
  }

  // ModifierGroup
  async createModifierGroup(data: any) {
    return this.prisma.modifierGroup.create({ data });
  }
  async updateModifierGroup(id: string, data: any) {
    return this.prisma.modifierGroup.update({ where: { id }, data });
  }
  async deleteModifierGroup(id: string) {
    return this.prisma.modifierGroup.delete({ where: { id } });
  }

  // ModifierOption
  async createModifierOption(data: any) {
    return this.prisma.modifierOption.create({ data });
  }
  async updateModifierOption(id: string, data: any) {
    return this.prisma.modifierOption.update({ where: { id }, data });
  }
  async deleteModifierOption(id: string) {
    return this.prisma.modifierOption.delete({ where: { id } });
  }

  // PriceRule
  async createPriceRule(data: any) {
    return this.prisma.priceRule.create({ data });
  }
  async updatePriceRule(id: string, data: any) {
    return this.prisma.priceRule.update({ where: { id }, data });
  }
  async deletePriceRule(id: string) {
    return this.prisma.priceRule.delete({ where: { id } });
  }

  // ItemAvailability
  async createAvailability(data: any) {
    return this.prisma.itemAvailability.create({ data });
  }
  async updateAvailability(id: string, data: any) {
    return this.prisma.itemAvailability.update({ where: { id }, data });
  }
  async deleteAvailability(id: string) {
    return this.prisma.itemAvailability.delete({ where: { id } });
  }

  // Active Menu Resolution
  async getActiveMenuForBranch(branchId: string, channel: string = 'DINE_IN') {
    // 1. Get branch and its restaurant
    const branch = await this.prisma.branch.findUnique({
      where: { id: branchId },
    });
    if (!branch) throw new Error('Branch not found');

    // 2. Find active menu for this branch or restaurant
    const menu = await this.prisma.menu.findFirst({
      where: {
        status: 'ACTIVE',
        OR: [
          { branchId: branch.id },
          { restaurantId: branch.restaurantId, branchId: null },
        ],
      },
      orderBy: { branchId: 'asc' }, // Prefer branch specific
      include: {
        categories: {
          where: { status: 'ACTIVE' },
          orderBy: { sortOrder: 'asc' },
          include: {
            placements: {
              where: { status: 'ACTIVE' },
              orderBy: { sortOrder: 'asc' },
              include: {
                menuItem: {
                  include: {
                    modifierGroups: {
                      where: { status: 'ACTIVE' },
                      orderBy: { sortOrder: 'asc' },
                      include: {
                        options: {
                          where: { status: 'ACTIVE' },
                          orderBy: { sortOrder: 'asc' },
                        },
                      },
                    },
                    priceRules: {
                      where: {
                        status: 'ACTIVE',
                        OR: [{ channel }, { channel: 'ALL' }],
                      },
                    },
                    availability: true,
                    taxCategory: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!menu) return null;

    // Resolve prices based on branch and channel priority
    for (const category of (menu as any).categories) {
      for (const placement of category.placements) {
        const item = placement.menuItem;
        if (item.status !== 'ACTIVE') {
          item.isCurrentlyAvailable = false;
          continue;
        }

        const rules = item.priceRules;
        if (rules && rules.length > 0) {
          rules.sort((a: any, b: any) => b.priority - a.priority);
          const bestRule = rules[0];
          item.effectivePriceMinor = bestRule.priceMinor;
        } else {
          item.effectivePriceMinor = item.basePriceMinor;
        }

        item.isCurrentlyAvailable = true;
        if (item.availability && item.availability.length > 0) {
          const manualOff = item.availability.find(
            (a: any) =>
              a.manualOverride === 'UNAVAILABLE' &&
              (a.branchId === branchId || a.branchId === null),
          );
          if (manualOff) item.isCurrentlyAvailable = false;
        }
      }
    }

    return menu;
  }
}
