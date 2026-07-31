export interface PaymentIntentInput {
  amountMinor: number;
  currency: string;
  orderId: string;
  receiptId?: string;
}

export interface PaymentIntentResult {
  providerOrderId: string;
  status: string;
  amount: number;
}

export interface PaymentProvider {
  createPaymentIntent(input: PaymentIntentInput): Promise<PaymentIntentResult>;
  capturePayment(paymentId: string, amountMinor: number): Promise<boolean>;
  refundPayment(paymentId: string, amountMinor: number): Promise<boolean>;
  verifyWebhook(payload: any, signature: string, secret: string): boolean;
  getPaymentStatus(paymentId: string): Promise<string>;
}
