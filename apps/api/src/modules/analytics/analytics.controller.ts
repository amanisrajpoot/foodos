import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Add proper auth guard later

// @UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard/today')
  async getTodayKpis(
    @Query('organizationId') organizationId: string,
    @Query('branchId') branchId?: string,
  ) {
    return this.analyticsService.getTodayKpis(organizationId, branchId);
  }

  @Get('dashboard/trends')
  async getTrendData(
    @Query('organizationId') organizationId: string,
    @Query('branchId') branchId?: string,
    @Query('days') days: number = 7,
  ) {
    return this.analyticsService.getTrendData(organizationId, branchId, days);
  }

  @Get('reports/daily-summary')
  async getDailySummary(
    @Query('organizationId') organizationId: string,
    @Query('date') date: string,
    @Query('branchId') branchId?: string,
  ) {
    return this.analyticsService.getDailySummary(organizationId, date, branchId);
  }
}
