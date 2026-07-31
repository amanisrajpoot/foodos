import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../shared/providers/prisma/prisma.service';

@Injectable()
export class PurchaseOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string) {
    return this.prisma.purchaseOrder.findMany({
      where: { organizationId },
      include: { supplier: true },
    });
  }

  async create(data: any) {
    return this.prisma.purchaseOrder.create({ data });
  }

  async receivePO(
    purchaseOrderId: string,
    lineReceipts: { lineId: string; quantity: number }[],
  ) {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id: purchaseOrderId },
      include: { lines: { include: { ingredient: true } } },
    });

    if (!po) throw new BadRequestException('Purchase order not found');

    for (const receipt of lineReceipts) {
      const line = po.lines.find((l) => l.id === receipt.lineId);
      if (!line) continue;

      // Update received quantity on PO line
      await this.prisma.purchaseOrderLine.update({
        where: { id: line.id },
        data: { receivedQuantity: { increment: receipt.quantity } },
      });

      // Create Stock Lot
      const stockLot = await this.prisma.stockLot.create({
        data: {
          organizationId: po.organizationId,
          branchId: po.branchId,
          ingredientId: line.ingredientId,
          quantityOnHand: receipt.quantity,
          unitOfMeasure: line.unitOfMeasure,
          unitCostMinor: line.unitCostMinor,
          currency: po.currency,
          receivedAt: new Date(),
          status: 'AVAILABLE',
        },
      });

      // Record Stock Movement
      await this.prisma.stockMovement.create({
        data: {
          organizationId: po.organizationId,
          branchId: po.branchId,
          ingredientId: line.ingredientId,
          stockLotId: stockLot.id,
          movementType: 'PURCHASE_RECEIPT',
          quantityDelta: receipt.quantity,
          unitOfMeasure: line.unitOfMeasure,
          unitCostMinor: line.unitCostMinor,
          currency: po.currency,
          referenceType: 'PURCHASE_ORDER',
          referenceId: po.id,
        },
      });
    }

    // Mark PO as RECEIVED (simplification: assume all lines received)
    return this.prisma.purchaseOrder.update({
      where: { id: purchaseOrderId },
      data: { status: 'RECEIVED' },
    });
  }
}
