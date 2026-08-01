import { Controller, Post, Body, Param, Get, Patch, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';

// Basic DTOs
export class CreateOrderDto {
  organizationId: string;
  restaurantId: string;
  branchId: string;
  channel: string;
  source: string;
  tableId?: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
    specialInstructions?: string;
  }>;
}

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(dto);
  }

  @Get()
  async getOrders(@Query('branchId') branchId: string) {
    return this.ordersService.getOrders(branchId);
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    return this.ordersService.getOrderById(id);
  }

  @Patch(':id/confirm')
  async confirmOrder(@Param('id') id: string) {
    const order = await this.ordersService.confirmOrder(id);
    // Trigger post-confirmation without blocking the response
    this.ordersService.processPostConfirmation(order).catch(console.error);
    return order;
  }

  @Patch(':id/cancel')
  async cancelOrder(@Param('id') id: string, @Body('reason') reason: string) {
    return this.ordersService.cancelOrder(id, reason);
  }

  @Patch(':id/complete')
  async completeOrder(@Param('id') id: string) {
    return this.ordersService.completeOrder(id);
  }
}
