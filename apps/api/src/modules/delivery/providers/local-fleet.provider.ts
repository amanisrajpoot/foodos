import { Injectable, Logger } from '@nestjs/common';
import {
  DeliveryProvider,
  QuoteDeliveryInput,
  QuoteDeliveryResult,
  CreateDeliveryTaskInput,
  CreateDeliveryTaskResult,
} from '../interfaces/delivery-provider.interface';

@Injectable()
export class LocalFleetProvider implements DeliveryProvider {
  private readonly logger = new Logger(LocalFleetProvider.name);

  async quoteDelivery(input: QuoteDeliveryInput): Promise<QuoteDeliveryResult> {
    this.logger.log(`Quoting delivery for local fleet. Org: ${input.organizationId}`);
    // Local fleet deliveries are often assumed to be zero cost or flat cost to the restaurant directly
    return {
      estimatedCostMinor: 0,
      currency: 'INR',
      etaMinutes: 30,
      providerQuoteId: `local-quote-${Date.now()}`,
    };
  }

  async createDeliveryTask(input: CreateDeliveryTaskInput): Promise<CreateDeliveryTaskResult> {
    this.logger.log(`Creating delivery task for local fleet. Assignment ID: ${input.deliveryAssignmentId}`);
    // For local fleet, the providerTaskId can just be a prefix + the internal ID, or just the internal ID.
    return {
      providerTaskId: `local-task-${input.deliveryAssignmentId}`,
      status: 'PENDING',
    };
  }

  async cancelDeliveryTask(providerTaskId: string): Promise<boolean> {
    this.logger.log(`Cancelling local fleet delivery task: ${providerTaskId}`);
    return true;
  }

  async trackDelivery(providerTaskId: string): Promise<any> {
    this.logger.log(`Tracking local fleet delivery task: ${providerTaskId}`);
    return { status: 'UNKNOWN' };
  }

  async verifyWebhook(payload: any, signature: string): Promise<boolean> {
    this.logger.log('Verifying webhook for local fleet provider (Stub)');
    return true;
  }
}
