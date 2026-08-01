import { Controller, Get, Headers } from '@nestjs/common';
import { AlertsService } from '../services/alerts.service';

@Controller('inventory/alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  async findActiveAlerts(
    @Headers('x-organization-id') organizationId: string,
    @Headers('x-branch-id') branchId: string,
  ) {
    return this.alertsService.findActiveAlerts(organizationId, branchId);
  }
}
