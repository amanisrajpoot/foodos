import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async createCustomer(@Body() data: any) {
    // In a real scenario, organizationId should come from the auth context.
    return this.customersService.createCustomer(data);
  }

  @Get()
  async getCustomers(
    @Query('organizationId') organizationId: string,
    @Query('q') query?: string,
  ) {
    if (query) {
      return this.customersService.searchCustomers(organizationId, query);
    }
    return this.customersService.getCustomers(organizationId);
  }

  @Get(':id')
  async getCustomer(
    @Param('id') id: string,
    @Query('organizationId') organizationId: string,
  ) {
    return this.customersService.getCustomer(id, organizationId);
  }
}
