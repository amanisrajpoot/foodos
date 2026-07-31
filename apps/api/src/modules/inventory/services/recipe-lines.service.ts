import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/providers/prisma/prisma.service';
import { StockService } from './stock.service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class RecipeLinesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stockService: StockService,
  ) {}

  async getRecipe(menuItemId: string) {
    return this.prisma.recipeLine.findMany({
      where: { menuItemId },
      include: { ingredient: true },
    });
  }

  // Event Listener for order completion to trigger auto-deduction
  @OnEvent('order.completed')
  async handleOrderCompleted(payload: { orderId: string; branchId: string }) {
    const order = await this.prisma.order.findUnique({
      where: { id: payload.orderId },
      include: { items: true },
    });

    if (!order) return;

    for (const item of order.items) {
      // Find recipe for this menu item
      const recipeLines = await this.prisma.recipeLine.findMany({
        where: { menuItemId: item.menuItemId },
      });

      for (const line of recipeLines) {
        // Calculate total quantity needed (recipe quantity * order item quantity)
        const totalDeduction = line.quantity * item.quantity;

        // Use StockService to perform FIFO deduction
        await this.stockService.deductFifoStock(
          line.ingredientId,
          totalDeduction,
          payload.branchId,
          'ORDER',
          order.id,
        );
      }
    }
  }
}
