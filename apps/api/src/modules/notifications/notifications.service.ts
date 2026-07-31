import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/providers/prisma/prisma.service';
import { OutboxPublisherService } from '../platform/outbox-publisher.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly outboxPublisher: OutboxPublisherService,
  ) {}

  async createNotification(
    orderId: string,
    organizationId: string,
    recipientAddress: string,
    channel: string,
    message: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const notification = await tx.notificationMessage.create({
        data: {
          organizationId,
          recipientType: 'CUSTOMER',
          recipientAddress,
          channel,
          status: 'QUEUED',
          payload: { orderId, message },
          queuedAt: new Date(),
        },
      });

      await this.outboxPublisher.publish(tx, {
        organizationId,
        eventName: 'notifications.message.queued.v1',
        aggregateType: 'NotificationMessage',
        aggregateId: notification.id,
        payloadJson: notification,
      });

      return notification;
    });
  }
}
