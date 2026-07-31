import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Param,
  Body,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  // --- Onboarding & Activation ---

  @Post('onboard')
  async onboardFullRestaurant(@Body() body: any) {
    return this.restaurantService.onboardFullRestaurant(body);
  }

  @Post('branches/:id/activate')
  async activateBranch(@Param('id') id: string) {
    return this.restaurantService.validateAndActivateBranch(id);
  }

  // --- Organizations ---

  @Post('orgs')
  async createOrganization(@Body() body: any) {
    return this.restaurantService.createOrganization(body);
  }

  @Get('orgs/:id')
  async getOrganization(@Param('id') id: string) {
    return this.restaurantService.getOrganization(id);
  }

  // --- Restaurant Brands ---

  @Post()
  async createRestaurant(@Body() body: any) {
    return this.restaurantService.createRestaurant(body);
  }

  @Get('orgs/:orgId/restaurants')
  async getRestaurants(@Param('orgId') orgId: string) {
    return this.restaurantService.getRestaurants(orgId);
  }

  @Get(':id')
  async getRestaurantDetail(@Param('id') id: string) {
    return this.restaurantService.getRestaurantDetail(id);
  }

  @Patch(':id')
  async updateRestaurant(@Param('id') id: string, @Body() body: any) {
    return this.restaurantService.updateRestaurant(id, body);
  }

  // --- Branches ---

  @Post('branches')
  async createBranch(@Body() body: any) {
    return this.restaurantService.createBranch(body);
  }

  @Get(':id/branches')
  async getBranches(@Param('id') id: string) {
    return this.restaurantService.getBranches(id);
  }

  @Get('branches/:branchId')
  async getBranchDetail(@Param('branchId') branchId: string) {
    return this.restaurantService.getBranchDetail(branchId);
  }

  @Patch('branches/:branchId')
  async updateBranch(@Param('branchId') branchId: string, @Body() body: any) {
    return this.restaurantService.updateBranch(branchId, body);
  }

  // --- Tables & Floorplan ---

  @Get('branches/:branchId/tables')
  async getBranchTables(@Param('branchId') branchId: string) {
    return this.restaurantService.getBranchTables(branchId);
  }

  @Post('branches/:branchId/tables')
  async manageDiningTables(
    @Param('branchId') branchId: string,
    @Body('organizationId') bodyOrgId: string,
    @Body('tables') tables: any[],
    @Headers('x-organization-id') headerOrgId?: string,
  ) {
    const orgId = bodyOrgId || headerOrgId || '00000000-0000-0000-0000-000000000000';
    return this.restaurantService.manageDiningTables(branchId, orgId, tables || []);
  }

  // --- Settings ---

  @Put('branches/:branchId/settings')
  async updateBranchSettings(
    @Param('branchId') branchId: string,
    @Body() body: any,
  ) {
    return this.restaurantService.updateBranchSettings(branchId, body);
  }
}
