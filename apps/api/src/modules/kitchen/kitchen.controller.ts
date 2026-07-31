import { Controller, Post, Body, Param, Get, Patch } from '@nestjs/common';
import { KitchenService } from './kitchen.service';

export class UpdateTicketStatusDto {
  status: string; // ACCEPTED, PREPARING, READY, SERVED, CANCELLED
}

@Controller('kitchen')
export class KitchenController {
  constructor(private readonly kitchenService: KitchenService) {}

  @Patch('tickets/:id/status')
  async updateTicketStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTicketStatusDto,
  ) {
    return this.kitchenService.updateTicketStatus(id, dto.status);
  }

  @Patch('ticket-items/:id/status')
  async updateTicketItemStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.kitchenService.updateTicketItemStatus(id, status);
  }
}
