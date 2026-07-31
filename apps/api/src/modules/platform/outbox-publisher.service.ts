import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export interface PublishEventParams {
  organizationId: string;
  eventName: string;
  aggregateType: string;
  aggregateId: string;
  payloadJson: any;
  metadataJson?: any;
}

@Injectable()
export class OutboxPublisherService {
  /**
   * Publishes a domain event to the outbox within the current database transaction.
   * This guarantees that the event is only published if the business transaction commits.
   */
  async publish(
    tx: Prisma.TransactionClient,
    params: PublishEventParams,
  ): Promise<void> {
    await tx.domainEventOutbox.create({
      data: {
        organizationId: params.organizationId,
        eventName: params.eventName,
        aggregateType: params.aggregateType,
        aggregateId: params.aggregateId,
        payloadJson: params.payloadJson,
        metadataJson: params.metadataJson || {},
        status: 'PENDING',
      },
    });
  }
}
