import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';

@Controller('customers/:customerId/addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  async createAddress(
    @Param('customerId') customerId: string,
    @Body() data: any,
  ) {
    return this.addressesService.createAddress({ ...data, customerId });
  }

  @Get()
  async getAddresses(
    @Param('customerId') customerId: string,
    @Query('organizationId') organizationId: string,
  ) {
    return this.addressesService.getCustomerAddresses(
      customerId,
      organizationId,
    );
  }

  @Delete(':id')
  async deleteAddress(
    @Param('id') id: string,
    @Query('organizationId') organizationId: string,
  ) {
    return this.addressesService.deleteAddress(id, organizationId);
  }
}
