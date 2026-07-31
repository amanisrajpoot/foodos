import { Injectable } from '@nestjs/common';
import {
  PaymentProvider,
  PaymentIntentInput,
  PaymentIntentResult,
} from './payment-provider.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class CashProvider implements PaymentProvider {
  async createPaymentIntent(
    input: PaymentIntentInput,
  ): Promise<PaymentIntentResult> {
    // For cash, intent is instantly created and ready to be captured
    return {
      providerOrderId: `cash_order_${randomUUID()}`,
      status: 'CREATED',
      amount: input.amountMinor,
    };
  }

  async capturePayment(
    paymentId: string,
    amountMinor: number,
  ): Promise<boolean> {
    // Cash is immediately captured upon collection
    return true;
  }

  async refundPayment(
    paymentId: string,
    amountMinor: number,
  ): Promise<boolean> {
    // Cash refunds are manual
    return true;
  }

  verifyWebhook(payload: any, signature: string, secret: string): boolean {
    return true; // Cash doesn't use webhooks
  }

  async getPaymentStatus(paymentId: string): Promise<string> {
    return 'CAPTURED';
  }
}
