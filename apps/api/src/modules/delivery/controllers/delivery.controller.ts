import { Controller, Get, Post, Patch, Put, Param, Body, Query, Headers } from '@nestjs/common';
import { DeliveryService } from '../services/delivery.service';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  // --- Driver Onboarding & Management ---

  @Post('drivers/onboard')
  async onboardDriver(
    @Body() body: any,
    @Headers('x-organization-id') headerOrgId?: string,
  ) {
    const orgId = body.organizationId || headerOrgId || '00000000-0000-0000-0000-000000000000';
    return this.deliveryService.onboardDriver({ ...body, organizationId: orgId });
  }

  @Patch('drivers/:id/kyc')
  async verifyDriverKyc(
    @Param('id') driverId: string,
    @Body('kycStatus') kycStatus: 'VERIFIED' | 'REJECTED',
  ) {
    return this.deliveryService.verifyDriverKyc(driverId, kycStatus);
  }

  @Get('drivers')
  async getDrivers(
    @Query('branchId') branchId: string,
    @Query('status') status?: string,
  ) {
    return this.deliveryService.getDrivers(branchId, status);
  }

  @Get('drivers/:id')
  async getDriverProfile(@Param('id') id: string) {
    return this.deliveryService.getDriverProfile(id);
  }

  @Patch('drivers/:id/status')
  async updateDriverStatus(
    @Param('id') driverId: string,
    @Body('status') status: string,
  ) {
    return this.deliveryService.updateDriverStatus(driverId, status);
  }

  @Post('drivers/:id/location')
  async updateDriverLocation(
    @Param('id') driverId: string,
    @Body('latitude') latitude: number,
    @Body('longitude') longitude: number,
  ) {
    return this.deliveryService.updateDriverLocation(driverId, latitude, longitude);
  }

  // --- 3P Delivery Partner Settings & Auto Dispatch ---

  @Get('partners/configs')
  async getPartnerConfigs(@Query('branchId') branchId: string) {
    return this.deliveryService.getPartnerConfigs(branchId);
  }

  @Put('partners/configs')
  async upsertPartnerConfig(
    @Query('branchId') branchId: string,
    @Body() body: any,
    @Headers('x-organization-id') headerOrgId?: string,
  ) {
    const orgId = body.organizationId || headerOrgId || '00000000-0000-0000-0000-000000000000';
    return this.deliveryService.upsertPartnerConfig(branchId, orgId, body);
  }

  @Post('dispatch/auto')
  async evaluateAutoDispatch(@Body('orderId') orderId: string) {
    return this.deliveryService.evaluateAutoDispatch(orderId);
  }

  // --- Active Delivery Operations ---

  @Get('active')
  async getActiveDeliveries(@Query('branchId') branchId: string) {
    return this.deliveryService.getActiveDeliveries(branchId);
  }

  @Post('assignments/:id/assign')
  async assignDriver(
    @Param('id') assignmentId: string,
    @Body('driverId') driverId: string,
  ) {
    return this.deliveryService.assignDriver(assignmentId, driverId);
  }

  // --- Driver App Endpoints ---

  @Get('driver/:driverId/assignments')
  async getDriverAssignments(@Param('driverId') driverId: string) {
    return this.deliveryService.getDriverAssignments(driverId);
  }

  @Patch('assignments/:id/status')
  async updateAssignmentStatus(
    @Param('id') assignmentId: string,
    @Body('status') status: string,
    @Body('latitude') latitude?: number,
    @Body('longitude') longitude?: number,
  ) {
    return this.deliveryService.updateDeliveryStatus(assignmentId, status, latitude, longitude);
  }
}
