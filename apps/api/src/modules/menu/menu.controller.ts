import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { TenantGuard } from '../../shared/guards/tenant.guard';
import { RbacGuard, Permissions } from '../../shared/guards/rbac.guard';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('active/:branchId')
  async getActiveMenu(
    @Param('branchId') branchId: string,
    @Query('channel') channel: string,
  ) {
    return this.menuService.getActiveMenuForBranch(
      branchId,
      channel || 'DINE_IN',
    );
  }

  // Use guards for management endpoints
  @Post('restaurants/:restId/menus')
  @UseGuards(TenantGuard, RbacGuard)
  @Permissions('menu.menu.create')
  async createMenu(@Param('restId') restId: string, @Body() body: any) {
    return this.menuService.createMenu({ ...body, restaurantId: restId });
  }

  @Get('restaurants/:restId/menus')
  @UseGuards(TenantGuard, RbacGuard)
  @Permissions('menu.menu.read')
  async getMenus(@Param('restId') restId: string) {
    return this.menuService.getMenus(restId);
  }

  @Get('menus/:id')
  @UseGuards(TenantGuard, RbacGuard)
  @Permissions('menu.menu.read')
  async getMenu(@Param('id') id: string) {
    return this.menuService.getMenu(id);
  }

  @Put('menus/:id')
  @UseGuards(TenantGuard, RbacGuard)
  @Permissions('menu.menu.update')
  async updateMenu(@Param('id') id: string, @Body() body: any) {
    return this.menuService.updateMenu(id, body);
  }

  @Delete('menus/:id')
  @UseGuards(TenantGuard, RbacGuard)
  @Permissions('menu.menu.delete')
  async deleteMenu(@Param('id') id: string) {
    return this.menuService.deleteMenu(id);
  }

  // Categories
  @Post('categories')
  @UseGuards(TenantGuard, RbacGuard)
  @Permissions('menu.category.create')
  async createCategory(@Body() body: any) {
    return this.menuService.createCategory(body);
  }

  @Put('categories/:id')
  @UseGuards(TenantGuard, RbacGuard)
  @Permissions('menu.category.update')
  async updateCategory(@Param('id') id: string, @Body() body: any) {
    return this.menuService.updateCategory(id, body);
  }

  // Items
  @Post('items')
  @UseGuards(TenantGuard, RbacGuard)
  @Permissions('menu.item.create')
  async createItem(@Body() body: any) {
    return this.menuService.createMenuItem(body);
  }

  @Get('restaurants/:restId/items')
  @UseGuards(TenantGuard, RbacGuard)
  @Permissions('menu.item.read')
  async getItems(@Param('restId') restId: string) {
    return this.menuService.getMenuItems(restId);
  }

  @Get('items/:id')
  @UseGuards(TenantGuard, RbacGuard)
  @Permissions('menu.item.read')
  async getItem(@Param('id') id: string) {
    return this.menuService.getMenuItem(id);
  }

  @Put('items/:id')
  @UseGuards(TenantGuard, RbacGuard)
  @Permissions('menu.item.update')
  async updateItem(@Param('id') id: string, @Body() body: any) {
    return this.menuService.updateMenuItem(id, body);
  }

  // Sub-entities (placements, modifiers, pricing, availability) can be managed via simplified endpoints
  @Post('placements')
  @UseGuards(TenantGuard, RbacGuard)
  @Permissions('menu.menu.update')
  async createPlacement(@Body() body: any) {
    return this.menuService.createPlacement(body);
  }

  @Post('modifier-groups')
  @UseGuards(TenantGuard, RbacGuard)
  @Permissions('menu.modifier.create')
  async createModifierGroup(@Body() body: any) {
    return this.menuService.createModifierGroup(body);
  }

  @Post('modifier-options')
  @UseGuards(TenantGuard, RbacGuard)
  @Permissions('menu.modifier.create')
  async createModifierOption(@Body() body: any) {
    return this.menuService.createModifierOption(body);
  }

  @Post('price-rules')
  @UseGuards(TenantGuard, RbacGuard)
  @Permissions('menu.pricing.create')
  async createPriceRule(@Body() body: any) {
    return this.menuService.createPriceRule(body);
  }

  @Post('availability')
  @UseGuards(TenantGuard, RbacGuard)
  @Permissions('menu.availability.update')
  async createAvailability(@Body() body: any) {
    return this.menuService.createAvailability(body);
  }
}
