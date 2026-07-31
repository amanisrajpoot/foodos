import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/providers/prisma/prisma.service';
import { OutboxPublisherService } from '../platform/outbox-publisher.service';

@Injectable()
export class KitchenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly outboxPublisher: OutboxPublisherService,
  ) {}

  // In a real app this would be triggered by an event handler listening to 'orders.order.accepted.v1'
  // For Sprint 3, we can call this directly or simulate it
  async generateTicketsForOrder(orderId: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order) throw new NotFoundException('Order not found');

      // Simple implementation: group all items into one main ticket
      const ticketNumber = `TKT-${Math.floor(Math.random() * 10000)}`;

      const ticket = await tx.kitchenTicket.create({
        data: {
          organizationId: order.organizationId,
          branchId: order.branchId,
          orderId: order.id,
          ticketNumber,
          station: 'MAIN',
          status: 'QUEUED',
          items: {
            create: order.items.map((item) => ({
              organizationId: order.organizationId,
              orderItemId: item.id,
              nameSnapshot: item.nameSnapshot,
              quantity: item.quantity,
              station: 'MAIN',
              status: 'QUEUED',
            })),
          },
        },
        include: { items: true },
      });

      await this.outboxPublisher.publish(tx, {
        organizationId: order.organizationId,
        eventName: 'kitchen.ticket.created.v1',
        aggregateType: 'KitchenTicket',
        aggregateId: ticket.id,
        payloadJson: ticket,
      });

      return ticket;
    });
  }

  async updateTicketStatus(ticketId: string, status: string) {
    return this.prisma.$transaction(async (tx) => {
      const ticket = await tx.kitchenTicket.update({
        where: { id: ticketId },
        data: { status },
      });

      const eventName = `kitchen.ticket.${status.toLowerCase()}.v1`;

      await this.outboxPublisher.publish(tx, {
        organizationId: ticket.organizationId,
        eventName,
        aggregateType: 'KitchenTicket',
        aggregateId: ticket.id,
        payloadJson: ticket,
      });

      return ticket;
    });
  }

  async updateTicketItemStatus(itemId: string, status: string) {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.kitchenTicketItem.update({
        where: { id: itemId },
        data: { status },
      });

      await this.outboxPublisher.publish(tx, {
        organizationId: item.organizationId,
        eventName: 'kitchen.ticket_item.status_changed.v1',
        aggregateType: 'KitchenTicketItem',
        aggregateId: item.id,
        payloadJson: item,
      });

      return item;
    });
  }
}
