import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../shared/providers/prisma/prisma.service';

@Injectable()
export class StockService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllLots(organizationId: string, branchId: string) {
    return this.prisma.stockLot.findMany({
      where: { organizationId, branchId },
    });
  }

  async adjustStock(data: any) {
    return this.prisma.stockMovement.create({ data });
  }

  async deductFifoStock(
    ingredientId: string,
    quantityToDeduct: number,
    branchId: string,
    referenceType: string,
    referenceId: string,
  ) {
    if (quantityToDeduct <= 0) return;

    // Find all available stock lots for this ingredient at this branch, ordered by receivedAt (FIFO)
    const availableLots = await this.prisma.stockLot.findMany({
      where: {
        ingredientId,
        branchId,
        quantityOnHand: { gt: 0 },
        status: 'AVAILABLE',
      },
      orderBy: [
        { expiresAt: 'asc' }, // Prioritize expiring soon if perishable
        { receivedAt: 'asc' },
      ],
    });

    let remainingToDeduct = quantityToDeduct;

    for (const lot of availableLots) {
      if (remainingToDeduct <= 0) break;

      const deductionAmount = Math.min(lot.quantityOnHand, remainingToDeduct);

      // Deduct from lot
      await this.prisma.stockLot.update({
        where: { id: lot.id },
        data: {
          quantityOnHand: { decrement: deductionAmount },
          status:
            lot.quantityOnHand - deductionAmount === 0
              ? 'DEPLETED'
              : 'AVAILABLE',
        },
      });

      // Record movement
      await this.prisma.stockMovement.create({
        data: {
          organizationId: lot.organizationId,
          branchId: lot.branchId,
          ingredientId: lot.ingredientId,
          stockLotId: lot.id,
          movementType: 'ORDER_CONSUMPTION',
          quantityDelta: -deductionAmount,
          unitOfMeasure: lot.unitOfMeasure,
          unitCostMinor: lot.unitCostMinor,
          currency: lot.currency,
          referenceType,
          referenceId,
          reason: `Auto-deducted ${deductionAmount} for ${referenceType}`,
        },
      });

      remainingToDeduct -= deductionAmount;
    }

    if (remainingToDeduct > 0) {
      // Handle negative inventory case - log error or create a negative adjustment if allowed by policy
      console.warn(
        `Negative inventory scenario for ingredient ${ingredientId}. Short by ${remainingToDeduct}`,
      );
      // Optionally throw new BadRequestException('Insufficient stock to fulfill deduction.');
    }
  }
}
