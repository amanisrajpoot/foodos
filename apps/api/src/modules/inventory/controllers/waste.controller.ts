import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { WasteService } from '../services/waste.service';

@Controller('inventory/waste')
export class WasteController {
  constructor(private readonly wasteService: WasteService) {}

  @Post()
  async logWaste(
    @Body() data: any,
    @Headers('x-organization-id') organizationId: string,
    @Headers('x-branch-id') branchId: string,
  ) {
    return this.wasteService.logWaste({ ...data, organizationId, branchId });
  }
}
