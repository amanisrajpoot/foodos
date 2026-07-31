import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { FinanceService } from './finance.service';
import { TenantGuard } from '../../shared/guards/tenant.guard';
import { RbacGuard, Permissions } from '../../shared/guards/rbac.guard';

@Controller('finance')
@UseGuards(TenantGuard, RbacGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post('orgs/:orgId/taxes')
  @Permissions('finance.tax.create')
  async createTaxCategory(@Param('orgId') orgId: string, @Body() body: any) {
    return this.financeService.createTaxCategory({
      ...body,
      organizationId: orgId,
    });
  }

  @Get('orgs/:orgId/taxes')
  @Permissions('finance.tax.read')
  async getTaxCategories(@Param('orgId') orgId: string) {
    return this.financeService.getTaxCategories(orgId);
  }

  @Put('taxes/:id')
  @Permissions('finance.tax.update')
  async updateTaxCategory(@Param('id') id: string, @Body() body: any) {
    return this.financeService.updateTaxCategory(id, body);
  }

  @Delete('taxes/:id')
  @Permissions('finance.tax.delete')
  async deleteTaxCategory(@Param('id') id: string) {
    return this.financeService.deleteTaxCategory(id);
  }

  @Get('orgs/:orgId/invoices')
  @Permissions('finance.invoice.read')
  async getInvoices(@Param('orgId') orgId: string) {
    return this.financeService.getInvoices(orgId);
  }

  @Get('invoices/:id')
  @Permissions('finance.invoice.read')
  async getInvoiceById(@Param('id') id: string) {
    return this.financeService.getInvoiceById(id);
  }

  @Post('orders/:orderId/invoices')
  @Permissions('finance.invoice.issue')
  async generateInvoice(@Param('orderId') orderId: string) {
    return this.financeService.generateInvoice(orderId);
  }
}
