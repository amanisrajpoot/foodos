import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/providers/prisma/prisma.service';
import { AiProviderFactory } from './providers/ai-provider.factory';

@Injectable()
export class AiSummaryService {
  private readonly logger = new Logger(AiSummaryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly providerFactory: AiProviderFactory,
  ) {}

  async enrichDailySummary(organizationId: string, summaryId: string, providerType?: string) {
    this.logger.log(`Enriching Daily Business Summary ${summaryId} with AI narrative`);

    const summary = await this.prisma.dailyBusinessSummary.findFirst({
      where: { id: summaryId, organizationId },
    });

    if (!summary) {
      throw new NotFoundException(`Daily business summary ${summaryId} not found.`);
    }

    const provider = this.providerFactory.getProvider(providerType);

    const { narrative, anomalies } = await provider.generateNarrativeSummary({
      organizationId,
      branchId: summary.branchId || undefined,
      businessDate: summary.businessDate.toISOString().split('T')[0],
      salesTotalMinor: summary.salesTotalMinor,
      orderCount: summary.orderCount,
      topItems: (summary.topItemsJson as any) || [],
      lowStockItems: (summary.lowStockItemsJson as any) || [],
      riskFlags: (summary.riskFlagsJson as any) || [],
    });

    const updated = await this.prisma.dailyBusinessSummary.update({
      where: { id: summaryId },
      data: {
        aiNarrativeText: narrative,
        anomaliesJson: anomalies,
        aiModelProvider: provider.providerName,
        aiModelName: provider.defaultModelName,
        aiGeneratedAt: new Date(),
        generatedBy: 'AI',
      },
    });

    return updated;
  }
}
