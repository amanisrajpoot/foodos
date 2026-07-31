import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../shared/providers/prisma/prisma.service';
import { CashProvider } from '../integrations/providers/payment/cash.provider';
import { RazorpayProvider } from '../integrations/providers/payment/razorpay.provider';
import { FinanceService } from '../finance/finance.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cashProvider: CashProvider,
    private readonly razorpayProvider: RazorpayProvider,
    private readonly financeService: FinanceService,
  ) {}

  private getProvider(name: string) {
    if (name === 'CASH') return this.cashProvider;
    if (name === 'RAZORPAY') return this.razorpayProvider;
    throw new BadRequestException(`Provider ${name} not supported`);
  }

  async getPaymentsByOrg(organizationId: string) {
    return this.prisma.payment.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      include: { order: true },
    });
  }

  async initiatePayment(data: any) {
    // Basic implementation for creating intent and storing payment record
    const provider = this.getProvider(data.provider);

    // In a full implementation, we fetch order details to validate amount

    const intentResult = await provider.createPaymentIntent({
      amountMinor: data.amountMinor,
      currency: data.currency || 'INR',
      orderId: data.orderId,
    });

    return this.prisma.payment.create({
      data: {
        organizationId: data.organizationId,
        branchId: data.branchId,
        orderId: data.orderId,
        paymentNumber: `PAY-${Date.now()}`,
        provider: data.provider,
        method: data.method,
        status:
          intentResult.status === 'CREATED' ? 'PENDING' : intentResult.status,
        amountMinor: data.amountMinor,
        currency: data.currency || 'INR',
        providerOrderId: intentResult.providerOrderId,
      },
    });
  }

  async capturePayment(paymentId: string, amountMinor: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });
    if (!payment) throw new BadRequestException('Payment not found');

    const provider = this.getProvider(payment.provider);

    const captured = await provider.capturePayment(
      payment.providerPaymentId || payment.providerOrderId || paymentId,
      amountMinor,
    );

    if (captured) {
      const updatedPayment = await this.prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'CAPTURED',
          paidAt: new Date(),
        },
      });

      // Auto-generate invoice when payment is captured
      // In a real scenario, this would check if sum of all captured payments >= order.totalMinor
      // For this implementation, we simply generate it
      try {
        await this.financeService.generateInvoice(payment.orderId);
      } catch (err) {
        this.logger.error(
          `Failed to generate invoice for order ${payment.orderId}: ${err.message}`,
        );
      }

      return updatedPayment;
    }

    return payment;
  }
}
