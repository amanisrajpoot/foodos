import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { KpiSnapshotService } from './kpi-snapshot.service';
import { DailySummaryService } from './daily-summary.service';
import { PrismaModule } from '../../shared/providers/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, KpiSnapshotService, DailySummaryService],
  exports: [AnalyticsService, KpiSnapshotService, DailySummaryService],
})
export class AnalyticsModule {}
