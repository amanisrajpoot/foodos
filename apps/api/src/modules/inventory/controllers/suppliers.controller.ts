import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Headers,
} from '@nestjs/common';
import { SuppliersService } from '../services/suppliers.service';

@Controller('v1/inventory/suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  async findAll(@Headers('x-organization-id') organizationId: string) {
    return this.suppliersService.findAll(organizationId);
  }

  @Post()
  async create(
    @Body() data: any,
    @Headers('x-organization-id') organizationId: string,
  ) {
    return this.suppliersService.create({ ...data, organizationId });
  }
}
