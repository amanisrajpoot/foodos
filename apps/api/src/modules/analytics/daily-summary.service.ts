import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/providers/prisma/prisma.service';

@Injectable()
export class DailySummaryService {
  private readonly logger = new Logger(DailySummaryService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Called by a cron job or external AI trigger to summarize a branch's end-of-day.
   */
  async generateDailySummary(organizationId: string, branchId: string, date: Date) {
    this.logger.log(`Generating Daily Business Summary for branch ${branchId} on ${date.toISOString()}`);
    
    const branch = await this.prisma.branch.findUnique({ where: { id: branchId } });
    if (!branch) {
      this.logger.warn(`Branch ${branchId} not found, skipping daily summary.`);
      return null;
    }

    const cutoverMs = (branch.serviceDayCutoverMinutes || 0) * 60000;
    
    // In a real implementation with date-fns-tz, we would resolve date in branch.timezone
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const startOfBusinessDay = new Date(startOfDay.getTime() + cutoverMs);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    const endOfBusinessDay = new Date(endOfDay.getTime() + cutoverMs);

    // Get KPIs for the day
    const kpis = await this.prisma.kpiSnapshot.findMany({
      where: {
        organizationId,
        branchId,
        periodType: 'DAILY',
        periodStart: startOfDay,
      }
    });

    const revenueKpi = kpis.find(k => k.metricKey === 'total_revenue');
    const orderCountKpi = kpis.find(k => k.metricKey === 'order_count');

    const salesTotalMinor = Math.round((revenueKpi?.valueNumeric || 0) * 100);
    const orderCount = Math.round(orderCountKpi?.valueNumeric || 0);

    const summaryText = `Today we processed ${orderCount} orders generating ${revenueKpi?.valueNumeric || 0} in revenue. Operations were smooth.`;

    const summary = await this.prisma.dailyBusinessSummary.upsert({
      where: {
        branchId_businessDate: {
          branchId,
          businessDate: startOfDay,
        }
      },
      update: {
        summaryText,
        salesTotalMinor,
        orderCount,
        generatedAt: new Date(),
      },
      create: {
        organizationId,
        branchId,
        businessDate: startOfDay,
        summaryText,
        salesTotalMinor,
        orderCount,
        generatedBy: 'SYSTEM',
        generatedAt: new Date(),
      }
    });

    return summary;
  }
}
