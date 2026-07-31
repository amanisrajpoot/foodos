import { Injectable } from '@nestjs/common';
import {
  AiProvider,
  AiInsightContext,
  AiInsightResult,
  AiSummaryContext,
  AiInventoryContext,
  AiInventoryPrediction,
} from './ai-provider.interface';

@Injectable()
export class MockAiProvider implements AiProvider {
  readonly providerName = 'MOCK';
  readonly defaultModelName = 'foodos-heuristic-v1';

  async generateInsights(context: AiInsightContext): Promise<AiInsightResult[]> {
    const insights: AiInsightResult[] = [
      {
        insightType: 'SALES',
        severity: 'HIGH',
        title: 'Delivery Revenue Surge (7 PM - 9 PM)',
        body: 'Delivery orders surged 35% compared to last week during dinner rush. Top contributor: Butter Chicken combo meals.',
        recommendation: 'Ensure 2 dedicated packing staff are assigned between 6:30 PM and 9:30 PM to reduce dispatch latency.',
        confidenceScore: 0.92,
      },
      {
        insightType: 'INVENTORY',
        severity: 'MEDIUM',
        title: 'Tomatoes Stock Depletion Risk',
        body: 'Tomato consumption rate increased by 22% due to high volume of gravy dishes. Current stock will expire/run out in 2 days.',
        recommendation: 'Reorder 50kg Tomatoes from Fresh Produce Supplies (best price point in last 30 days).',
        confidenceScore: 0.88,
      },
      {
        insightType: 'KITCHEN',
        severity: 'LOW',
        title: 'Kitchen Ticket Prep Delay on Starters',
        body: 'Average prep time for Paneer Tikka spiked to 18 mins (target: 12 mins) during peak lunch hours.',
        recommendation: 'Pre-marinate additional 5kg Paneer during morning prep shift.',
        confidenceScore: 0.84,
      },
    ];

    return insights;
  }

  async generateNarrativeSummary(
    context: AiSummaryContext,
  ): Promise<{ narrative: string; anomalies: string[] }> {
    const revenueMajor = (context.salesTotalMinor / 100).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
    });

    const narrative = `Today generated ${revenueMajor} across ${context.orderCount} orders, performing 15% above average. Growth was primarily driven by a surge in online delivery orders during the 7-9 PM dinner window. Food cost maintained a healthy 28% margin.`;

    const anomalies = [
      '35% increase in dinner delivery volume',
      'Paneer Tikka prep time +6 mins above threshold',
      'Tomato stock depletion rate +22%',
    ];

    return { narrative, anomalies };
  }

  async generateInventoryPrediction(
    context: AiInventoryContext,
  ): Promise<AiInventoryPrediction> {
    const avgDailyConsumption =
      context.consumptionHistory.length > 0
        ? context.consumptionHistory.reduce((acc, cur) => acc + Math.abs(cur.quantityDelta), 0) /
          context.consumptionHistory.length
        : 5; // fallback 5 units per day

    const daysRemaining =
      avgDailyConsumption > 0 ? context.currentQuantityOnHand / avgDailyConsumption : 3;

    const stockoutDate = new Date();
    stockoutDate.setDate(stockoutDate.getDate() + Math.max(1, Math.round(daysRemaining)));

    const recommendedQty = Math.max(
      context.parLevel - context.currentQuantityOnHand,
      avgDailyConsumption * 7,
    );

    const supplierName = context.preferredSupplier?.name || 'Preferred Vendor';

    return {
      predictedStockoutDate: stockoutDate,
      predictedDaysRemaining: Math.round(daysRemaining * 10) / 10,
      recommendedQuantity: Math.round(recommendedQty),
      recommendation: `Reorder ${Math.round(recommendedQty)} ${context.unitOfMeasure} from ${supplierName} within ${Math.max(1, Math.floor(daysRemaining - 1))} day(s) to avoid stock-out.`,
      confidenceScore: 0.89,
    };
  }
}
