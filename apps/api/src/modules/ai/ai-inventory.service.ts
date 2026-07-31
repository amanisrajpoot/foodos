import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/providers/prisma/prisma.service';
import { AiProviderFactory } from './providers/ai-provider.factory';

@Injectable()
export class AiInventoryService {
  private readonly logger = new Logger(AiInventoryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly providerFactory: AiProviderFactory,
  ) {}

  async generateInventoryPredictions(organizationId: string, branchId: string, providerType?: string) {
    this.logger.log(`Generating AI inventory predictions for org ${organizationId}, branch ${branchId}`);

    const provider = this.providerFactory.getProvider(providerType);

    // Fetch active ingredients for this branch/org
    const ingredients = await this.prisma.ingredient.findMany({
      where: { organizationId, status: 'ACTIVE' },
      include: { preferredSupplier: true },
    });

    const enrichedAlerts: any[] = [];

    for (const ing of ingredients) {
      // Calculate current stock on hand
      const stockLots = await this.prisma.stockLot.findMany({
        where: { organizationId, branchId, ingredientId: ing.id, status: 'AVAILABLE' },
      });
      const currentQty = stockLots.reduce((sum, lot) => sum + lot.quantityOnHand, 0);

      // Fetch stock movements for history context
      const movements = await this.prisma.stockMovement.findMany({
        where: { organizationId, branchId, ingredientId: ing.id },
        orderBy: { createdAt: 'desc' },
        take: 30,
      });

      const prediction = await provider.generateInventoryPrediction({
        organizationId,
        branchId,
        ingredientId: ing.id,
        ingredientName: ing.name,
        unitOfMeasure: ing.unitOfMeasure,
        currentQuantityOnHand: currentQty,
        lowStockThreshold: ing.lowStockThreshold || 10,
        parLevel: ing.parLevel || 50,
        consumptionHistory: movements.map(m => ({
          date: m.createdAt.toISOString().split('T')[0],
          quantityDelta: m.quantityDelta,
        })),
        preferredSupplier: ing.preferredSupplier ? {
          name: ing.preferredSupplier.name,
          paymentTermsDays: ing.preferredSupplier.paymentTermsDays || 30,
        } : undefined,
      });

      // Find or create an InventoryAlert enriched with AI predictions
      const existingAlert = await this.prisma.inventoryAlert.findFirst({
        where: {
          organizationId,
          branchId,
          ingredientId: ing.id,
          status: 'OPEN',
        },
      });

      let alert;
      if (existingAlert) {
        alert = await this.prisma.inventoryAlert.update({
          where: { id: existingAlert.id },
          data: {
            predictedStockoutDate: prediction.predictedStockoutDate,
            predictedDaysRemaining: prediction.predictedDaysRemaining,
            aiRecommendation: prediction.recommendation,
            recommendedQuantity: prediction.recommendedQuantity,
            aiConfidenceScore: prediction.confidenceScore,
            aiModelProvider: provider.providerName,
            source: 'AI',
          },
        });
      } else if (prediction.predictedDaysRemaining <= 3) {
        alert = await this.prisma.inventoryAlert.create({
          data: {
            organizationId,
            branchId,
            ingredientId: ing.id,
            alertType: prediction.predictedDaysRemaining <= 1 ? 'OUT_OF_STOCK' : 'LOW_STOCK',
            severity: prediction.predictedDaysRemaining <= 1 ? 'CRITICAL' : 'HIGH',
            message: `${ing.name} predicted to stock out in ${prediction.predictedDaysRemaining} day(s).`,
            predictedStockoutDate: prediction.predictedStockoutDate,
            predictedDaysRemaining: prediction.predictedDaysRemaining,
            aiRecommendation: prediction.recommendation,
            recommendedQuantity: prediction.recommendedQuantity,
            unitOfMeasure: ing.unitOfMeasure,
            aiConfidenceScore: prediction.confidenceScore,
            aiModelProvider: provider.providerName,
            source: 'AI',
            status: 'OPEN',
          },
        });
      }

      if (alert) {
        enrichedAlerts.push(alert);
      }
    }

    return enrichedAlerts;
  }
}
