import { Injectable, Logger } from '@nestjs/common';
import { AiInsightService } from './ai-insight.service';
import { AiInventoryService } from './ai-inventory.service';

@Injectable()
export class AiCronPlaceholder {
  private readonly logger = new Logger(AiCronPlaceholder.name);

  constructor(
    private readonly aiInsightService: AiInsightService,
    private readonly aiInventoryService: AiInventoryService,
  ) {}

  /**
   * Placeholder cron task to generate nightly insights and predictive stock alerts.
   * Can be wired to NestJS @Cron() or external scheduler.
   */
  async runNightlyAiProcessing(organizationId: string, branchId: string) {
    this.logger.log(`Running scheduled AI processing for branch ${branchId}`);
    
    try {
      const insights = await this.aiInsightService.generateInsightsForBranch(organizationId, branchId);
      const alerts = await this.aiInventoryService.generateInventoryPredictions(organizationId, branchId);
      this.logger.log(`Nightly AI job complete: ${insights.length} insights, ${alerts.length} inventory predictions.`);
    } catch (err) {
      this.logger.error(`Nightly AI processing failed: ${err.message}`, err.stack);
    }
  }
}
