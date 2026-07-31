import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { TenantGuard } from '../../shared/guards/tenant.guard';
import { RbacGuard, Permissions } from '../../shared/guards/rbac.guard';

@Controller('staff')
@UseGuards(TenantGuard, RbacGuard)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @Permissions('staff.employee.create')
  async createEmployee(@Body() body: any) {
    return this.staffService.createEmployee(body);
  }

  @Get(':id')
  @Permissions('staff.employee.read')
  async getEmployee(@Param('id') id: string) {
    return this.staffService.getEmployee(id);
  }

  @Get('orgs/:orgId')
  @Permissions('staff.employee.read')
  async getEmployees(@Param('orgId') orgId: string) {
    return this.staffService.getEmployees(orgId);
  }

  @Put(':id')
  @Permissions('staff.employee.update')
  async updateEmployee(@Param('id') id: string, @Body() body: any) {
    return this.staffService.updateEmployee(id, body);
  }
}
