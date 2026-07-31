import { z } from 'zod';

export const PaymentSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  branchId: z.string().uuid(),
  orderId: z.string().uuid(),
  paymentNumber: z.string(),
  provider: z.enum(['CASH', 'RAZORPAY', 'CASHFREE', 'STRIPE', 'PHONEPE', 'OTHER']),
  method: z.enum(['CASH', 'CARD', 'UPI', 'WALLET', 'BANK_TRANSFER', 'ONLINE']),
  status: z.enum(['PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED']),
  amountMinor: z.number().int().min(1),
  currency: z.string().default('INR'),
  providerPaymentId: z.string().nullable().optional(),
  providerOrderId: z.string().nullable().optional(),
  failureCode: z.string().nullable().optional(),
  failureMessage: z.string().nullable().optional(),
  paidAt: z.date().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreatePaymentSchema = PaymentSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true,
  paymentNumber: true,
});

export const InvoiceSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  branchId: z.string().uuid(),
  orderId: z.string().uuid(),
  invoiceNumber: z.string(),
  status: z.enum(['DRAFT', 'ISSUED', 'VOIDED', 'CREDITED']),
  customerName: z.string().nullable().optional(),
  customerGstin: z.string().nullable().optional(),
  billingAddress: z.string().nullable().optional(),
  subtotalMinor: z.number().int().min(0),
  discountMinor: z.number().int().min(0),
  taxMinor: z.number().int().min(0),
  totalMinor: z.number().int().min(0),
  currency: z.string().default('INR'),
  issuedAt: z.date().nullable().optional(),
  voidedAt: z.date().nullable().optional(),
  pdfUrl: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateInvoiceSchema = InvoiceSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true,
  invoiceNumber: true,
});
