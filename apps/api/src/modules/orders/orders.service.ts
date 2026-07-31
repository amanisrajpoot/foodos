import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/providers/prisma/prisma.service';
import { OutboxPublisherService } from '../platform/outbox-publisher.service';
import { Prisma } from '@prisma/client';

import { KitchenService } from '../kitchen/kitchen.service';
import { NotificationsService } from '../notifications/notifications.service';
import { DeliveryService } from '../delivery/services/delivery.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly outboxPublisher: OutboxPublisherService,
    private readonly kitchenService: KitchenService,
    private readonly notificationsService: NotificationsService,
    private readonly deliveryService: DeliveryService,
  ) {}

  async createOrder(dto: any) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Fetch menu items to snapshot prices
      const menuItemIds = dto.items.map((i: any) => i.menuItemId);
      const menuItems = await tx.menuItem.findMany({
        where: { id: { in: menuItemIds } },
      });

      if (menuItems.length !== dto.items.length) {
        throw new BadRequestException('One or more menu items not found');
      }

      const itemLookup = new Map(menuItems.map((m) => [m.id, m]));

      // 2. Calculate totals
      let subtotalMinor = 0;
      const orderItemsData = dto.items.map((item: any) => {
        const menuItem = itemLookup.get(item.menuItemId)!;
        const lineTotalMinor = menuItem.basePriceMinor * item.quantity;
        subtotalMinor += lineTotalMinor;

        return {
          menuItemId: item.menuItemId,
          nameSnapshot: menuItem.name,
          quantity: item.quantity,
          unitPriceMinor: menuItem.basePriceMinor,
          lineTotalMinor,
          specialInstructions: item.specialInstructions,
        };
      });

      const totalMinor = subtotalMinor; // Ignoring tax/discount for now

      // Generate random order number for sprint 3 (replace with proper sequence generator later)
      const orderNumber = `ORD-${Math.floor(Math.random() * 1000000)}`;

      // CRM: Auto-create or resolve customer
      let customerId = dto.customerId;
      if (!customerId && dto.customerPhone) {
        let customer = await tx.customer.findFirst({
          where: { organizationId: dto.organizationId, phone: dto.customerPhone },
        });

        if (!customer) {
          customer = await tx.customer.create({
            data: {
              organizationId: dto.organizationId,
              fullName: dto.customerName || 'Guest',
              phone: dto.customerPhone,
            },
          });
        }
        customerId = customer.id;
      }

      // 3. Create Order
      const order = await tx.order.create({
        data: {
          organizationId: dto.organizationId,
          restaurantId: dto.restaurantId,
          branchId: dto.branchId,
          customerId, // Attach customer
          orderNumber,
          channel: dto.channel,
          source: dto.source,
          tableId: dto.tableId,
          status: 'DRAFT',
          subtotalMinor,
          totalMinor,
          items: {
            create: orderItemsData,
          },
        },
        include: { items: true },
      });

      // 4. Publish Event
      await this.outboxPublisher.publish(tx, {
        organizationId: dto.organizationId,
        eventName: 'orders.order.placed.v1',
        aggregateType: 'Order',
        aggregateId: order.id,
        payloadJson: order,
      });

      return order;
    });
  }

  async confirmOrder(orderId: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order) throw new NotFoundException('Order not found');
      if (order.status !== 'DRAFT') {
        throw new BadRequestException(
          'Order must be in DRAFT state to confirm',
        );
      }

      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'ACCEPTED', // or PLACED -> ACCEPTED
          acceptedAt: new Date(),
        },
        include: { items: true },
      });

      await this.outboxPublisher.publish(tx, {
        organizationId: updatedOrder.organizationId,
        eventName: 'orders.order.accepted.v1',
        aggregateType: 'Order',
        aggregateId: updatedOrder.id,
        payloadJson: updatedOrder,
      });

      // Generate tickets automatically for Sprint 3
      // We pass the transaction so KitchenService could theoretically participate,
      // but for now KitchenService creates its own transaction. So we call it after the transaction completes,
      // or we modify KitchenService to accept a tx. For Sprint 3 simulation, calling it without tx is fine.

      return updatedOrder;
    });
  }

  // Helper method called outside the tx, or could be handled by async event consumer
  async processPostConfirmation(order: any) {
    await this.kitchenService.generateTicketsForOrder(order.id);
    await this.notificationsService.createNotification(
      order.id,
      order.organizationId,
      'staff@restaurant.com',
      'EMAIL',
      `New order confirmed: ${order.orderNumber}`,
    );

    if (order.channel === 'DELIVERY') {
      try {
        await this.deliveryService.createDeliveryAssignment(order.id);
      } catch (err) {
        // Log the error but don't fail the order confirmation process
        console.error('Failed to auto-create delivery assignment:', err);
      }
    }
  }

  async completeOrder(orderId: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      });

      await this.outboxPublisher.publish(tx, {
        organizationId: order.organizationId,
        eventName: 'orders.order.completed.v1',
        aggregateType: 'Order',
        aggregateId: order.id,
        payloadJson: order,
      });

      return order;
    });
  }

  async cancelOrder(orderId: string, reason: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancelReason: reason,
        },
      });

      await this.outboxPublisher.publish(tx, {
        organizationId: order.organizationId,
        eventName: 'orders.order.cancelled.v1',
        aggregateType: 'Order',
        aggregateId: order.id,
        payloadJson: order,
      });

      return order;
    });
  }
}
