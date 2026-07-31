import { Module } from '@nestjs/common';
import { PrismaModule } from '../../shared/providers/prisma/prisma.module';
import { AiProviderFactory } from './providers/ai-provider.factory';
import { MockAiProvider } from './providers/mock-ai.provider';
import { OpenAiProvider } from './providers/openai.provider';
import { GeminiProvider } from './providers/gemini.provider';
import { AiInsightService } from './ai-insight.service';
import { AiSummaryService } from './ai-summary.service';
import { AiInventoryService } from './ai-inventory.service';
import { AiCronPlaceholder } from './ai-cron.placeholder';
import { AiController } from './ai.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AiController],
  providers: [
    AiProviderFactory,
    MockAiProvider,
    OpenAiProvider,
    GeminiProvider,
    AiInsightService,
    AiSummaryService,
    AiInventoryService,
    AiCronPlaceholder,
  ],
  exports: [
    AiInsightService,
    AiSummaryService,
    AiInventoryService,
    AiCronPlaceholder,
    AiProviderFactory,
  ],
})
export class AiModule {}
