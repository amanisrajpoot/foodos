import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/providers/prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async adjustBalance(data: {
    organizationId: string;
    customerId: string;
    transactionType: string;
    amountMinor: number;
    reason?: string;
  }) {
    // In a real application, we would use a transaction with locking to prevent race conditions
    return this.prisma.$transaction(async (tx) => {
      const lastTx = await tx.walletTransaction.findFirst({
        where: {
          customerId: data.customerId,
          organizationId: data.organizationId,
        },
        orderBy: { createdAt: 'desc' },
      });

      const currentBalance = lastTx?.balanceAfterMinor || 0;
      let newBalance = currentBalance;

      if (['CREDIT', 'REFUND'].includes(data.transactionType)) {
        newBalance += data.amountMinor;
      } else if (
        ['DEBIT', 'ADJUSTMENT', 'EXPIRY'].includes(data.transactionType)
      ) {
        newBalance -= data.amountMinor;
        if (newBalance < 0) {
          throw new BadRequestException('Insufficient wallet balance');
        }
      }

      return tx.walletTransaction.create({
        data: {
          organizationId: data.organizationId,
          customerId: data.customerId,
          transactionType: data.transactionType,
          amountMinor: data.amountMinor,
          balanceAfterMinor: newBalance,
          reason: data.reason,
        },
      });
    });
  }

  async getWalletTransactions(customerId: string, organizationId: string) {
    return this.prisma.walletTransaction.findMany({
      where: { customerId, organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBalance(customerId: string, organizationId: string) {
    const lastTx = await this.prisma.walletTransaction.findFirst({
      where: { customerId, organizationId },
      orderBy: { createdAt: 'desc' },
    });
    return { balanceMinor: lastTx?.balanceAfterMinor || 0 };
  }
}
