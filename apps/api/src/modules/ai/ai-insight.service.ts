import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/providers/prisma/prisma.service';
import { AiProviderFactory } from './providers/ai-provider.factory';

@Injectable()
export class AiInsightService {
  private readonly logger = new Logger(AiInsightService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly providerFactory: AiProviderFactory,
  ) {}

  async generateInsightsForBranch(organizationId: string, branchId?: string, providerType?: string) {
    this.logger.log(`Generating AI insights for org ${organizationId}, branch ${branchId}`);

    const provider = this.providerFactory.getProvider(providerType);

    // Fetch recent KPI snapshots for context
    const recentKpis = await this.prisma.kpiSnapshot.findMany({
      where: {
        organizationId,
        ...(branchId ? { branchId } : {}),
      },
      orderBy: { periodStart: 'desc' },
      take: 20,
    });

    // Fetch low stock items for context
    const lowStockItems = await this.prisma.inventoryAlert.findMany({
      where: {
        organizationId,
        ...(branchId ? { branchId } : {}),
        status: 'OPEN',
      },
      include: { ingredient: true },
      take: 10,
    });

    const aiResults = await provider.generateInsights({
      organizationId,
      branchId,
      recentKpis,
      lowStockItems,
    });

    const createdInsights: any[] = [];
    for (const result of aiResults) {
      const insight = await this.prisma.aIInsight.create({
        data: {
          organizationId,
          branchId,
          insightType: result.insightType,
          severity: result.severity,
          title: result.title,
          body: result.body,
          recommendation: result.recommendation,
          sourceEntityType: result.sourceEntityType,
          sourceEntityId: result.sourceEntityId,
          confidenceScore: result.confidenceScore || 0.85,
          modelProvider: provider.providerName,
          modelName: provider.defaultModelName,
          status: 'NEW',
        },
      });
      createdInsights.push(insight);
    }

    return createdInsights;
  }

  async findAll(organizationId: string, branchId?: string, status?: string, insightType?: string) {
    return this.prisma.aIInsight.findMany({
      where: {
        organizationId,
        ...(branchId ? { branchId } : {}),
        ...(status ? { status } : {}),
        ...(insightType ? { insightType } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, organizationId: string) {
    const insight = await this.prisma.aIInsight.findFirst({
      where: { id, organizationId },
    });
    if (!insight) {
      throw new NotFoundException(`AI Insight ${id} not found.`);
    }
    return insight;
  }

  async updateStatus(id: string, organizationId: string, status: 'ACKNOWLEDGED' | 'ACTIONED' | 'DISMISSED' | 'EXPIRED') {
    await this.findOne(id, organizationId);
    return this.prisma.aIInsight.update({
      where: { id },
      data: { status, updatedAt: new Date() },
    });
  }

  async getTopActiveInsights(organizationId: string, branchId?: string, limit: number = 3) {
    return this.prisma.aIInsight.findMany({
      where: {
        organizationId,
        ...(branchId ? { branchId } : {}),
        status: { in: ['NEW', 'ACKNOWLEDGED'] },
      },
      orderBy: [
        { severity: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    });
  }
}
