import { Injectable, Logger } from '@nestjs/common';
import {
  PaymentProvider,
  PaymentIntentInput,
  PaymentIntentResult,
} from './payment-provider.interface';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class RazorpayProvider implements PaymentProvider {
  private readonly logger = new Logger(RazorpayProvider.name);

  private getClient(keyId: string, keySecret: string): any {
    // We would dynamically instantiate this with the integration config keys
    // For now, we mock the instantiation to show the structure
    return new Razorpay({
      key_id: keyId || process.env.RAZORPAY_KEY_ID || 'dummy',
      key_secret: keySecret || process.env.RAZORPAY_KEY_SECRET || 'dummy',
    });
  }

  async createPaymentIntent(
    input: PaymentIntentInput,
  ): Promise<PaymentIntentResult> {
    const client = this.getClient('', '');
    try {
      const options = {
        amount: input.amountMinor,
        currency: input.currency,
        receipt: input.receiptId || input.orderId,
      };

      const order = await client.orders.create(options);

      return {
        providerOrderId: order.id,
        status: order.status,
        amount: order.amount,
      };
    } catch (error) {
      this.logger.error(`Failed to create Razorpay intent: ${error.message}`);
      throw error;
    }
  }

  async capturePayment(
    paymentId: string,
    amountMinor: number,
  ): Promise<boolean> {
    const client = this.getClient('', '');
    try {
      await client.payments.capture(paymentId, amountMinor, 'INR');
      return true;
    } catch (error) {
      this.logger.error(`Failed to capture Razorpay payment: ${error.message}`);
      return false;
    }
  }

  async refundPayment(
    paymentId: string,
    amountMinor: number,
  ): Promise<boolean> {
    const client = this.getClient('', '');
    try {
      await client.payments.refund(paymentId, { amount: amountMinor });
      return true;
    } catch (error) {
      this.logger.error(`Failed to refund Razorpay payment: ${error.message}`);
      return false;
    }
  }

  verifyWebhook(payload: any, signature: string, secret: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    return expectedSignature === signature;
  }

  async getPaymentStatus(paymentId: string): Promise<string> {
    const client = this.getClient('', '');
    try {
      const payment = await client.payments.fetch(paymentId);
      return payment.status;
    } catch (error) {
      this.logger.error(`Failed to fetch Razorpay payment: ${error.message}`);
      return 'FAILED';
    }
  }
}
