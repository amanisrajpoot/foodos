import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Query,
  Param,
  Headers,
} from '@nestjs/common';
import { AiInsightService } from './ai-insight.service';
import { AiSummaryService } from './ai-summary.service';
import { AiInventoryService } from './ai-inventory.service';

@Controller('v1/ai')
export class AiController {
  constructor(
    private readonly aiInsightService: AiInsightService,
    private readonly aiSummaryService: AiSummaryService,
    private readonly aiInventoryService: AiInventoryService,
  ) {}

  @Get('insights')
  async getInsights(
    @Headers('x-organization-id') headerOrgId: string,
    @Query('organizationId') queryOrgId?: string,
    @Query('branchId') branchId?: string,
    @Query('status') status?: string,
    @Query('insightType') insightType?: string,
  ) {
    const orgId = queryOrgId || headerOrgId || '00000000-0000-0000-0000-000000000000';
    return this.aiInsightService.findAll(orgId, branchId, status, insightType);
  }

  @Get('insights/:id')
  async getInsight(
    @Param('id') id: string,
    @Headers('x-organization-id') headerOrgId: string,
    @Query('organizationId') queryOrgId?: string,
  ) {
    const orgId = queryOrgId || headerOrgId || '00000000-0000-0000-0000-000000000000';
    return this.aiInsightService.findOne(id, orgId);
  }

  @Patch('insights/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'ACKNOWLEDGED' | 'ACTIONED' | 'DISMISSED' | 'EXPIRED',
    @Headers('x-organization-id') headerOrgId: string,
    @Query('organizationId') queryOrgId?: string,
  ) {
    const orgId = queryOrgId || headerOrgId || '00000000-0000-0000-0000-000000000000';
    return this.aiInsightService.updateStatus(id, orgId, status);
  }

  @Post('insights/generate')
  async generateInsights(
    @Body('organizationId') bodyOrgId: string,
    @Body('branchId') branchId?: string,
    @Body('provider') provider?: string,
    @Headers('x-organization-id') headerOrgId?: string,
  ) {
    const orgId = bodyOrgId || headerOrgId || '00000000-0000-0000-0000-000000000000';
    return this.aiInsightService.generateInsightsForBranch(orgId, branchId, provider);
  }

  @Post('summaries/enrich')
  async enrichSummary(
    @Body('summaryId') summaryId: string,
    @Body('organizationId') bodyOrgId: string,
    @Body('provider') provider?: string,
    @Headers('x-organization-id') headerOrgId?: string,
  ) {
    const orgId = bodyOrgId || headerOrgId || '00000000-0000-0000-0000-000000000000';
    return this.aiSummaryService.enrichDailySummary(orgId, summaryId, provider);
  }

  @Post('inventory/predict')
  async predictInventory(
    @Body('branchId') branchId: string,
    @Body('organizationId') bodyOrgId: string,
    @Body('provider') provider?: string,
    @Headers('x-organization-id') headerOrgId?: string,
  ) {
    const orgId = bodyOrgId || headerOrgId || '00000000-0000-0000-0000-000000000000';
    return this.aiInventoryService.generateInventoryPredictions(orgId, branchId, provider);
  }

  @Get('dashboard')
  async getDashboardAiFeed(
    @Headers('x-organization-id') headerOrgId: string,
    @Query('organizationId') queryOrgId?: string,
    @Query('branchId') branchId?: string,
  ) {
    const orgId = queryOrgId || headerOrgId || '00000000-0000-0000-0000-000000000000';
    const insights = await this.aiInsightService.getTopActiveInsights(orgId, branchId, 3);

    // If no insights exist yet, trigger initial generation
    if (insights.length === 0) {
      const generated = await this.aiInsightService.generateInsightsForBranch(orgId, branchId);
      return { insights: generated.slice(0, 3) };
    }

    return { insights };
  }
}
