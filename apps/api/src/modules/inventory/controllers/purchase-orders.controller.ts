import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Headers,
} from '@nestjs/common';
import { PurchaseOrdersService } from '../services/purchase-orders.service';

@Controller('v1/inventory/purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly poService: PurchaseOrdersService) {}

  @Get()
  async findAll(@Headers('x-organization-id') organizationId: string) {
    return this.poService.findAll(organizationId);
  }

  @Post()
  async create(
    @Body() data: any,
    @Headers('x-organization-id') organizationId: string,
    @Headers('x-branch-id') branchId: string,
  ) {
    return this.poService.create({ ...data, organizationId, branchId });
  }

  @Post(':id/receive')
  async receivePO(@Param('id') id: string, @Body() lineReceipts: any[]) {
    return this.poService.receivePO(id, lineReceipts);
  }
}
