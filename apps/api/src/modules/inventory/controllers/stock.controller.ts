import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  Param,
  Query,
} from '@nestjs/common';
import { StockService } from '../services/stock.service';

@Controller('inventory/stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('lots')
  async findAllLots(
    @Headers('x-organization-id') organizationId: string,
    @Headers('x-branch-id') branchId: string,
  ) {
    return this.stockService.findAllLots(organizationId, branchId);
  }

  @Post('adjust')
  async adjustStock(
    @Body() data: any,
    @Headers('x-organization-id') organizationId: string,
    @Headers('x-branch-id') branchId: string,
  ) {
    return this.stockService.adjustStock({ ...data, organizationId, branchId });
  }
}
