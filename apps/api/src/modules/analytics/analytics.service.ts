import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/providers/prisma/prisma.service';
import { KpiSnapshotService } from './kpi-snapshot.service';
import { DailySummaryService } from './daily-summary.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly kpiSnapshotService: KpiSnapshotService,
    private readonly dailySummaryService: DailySummaryService,
  ) {}

  async getTodayKpis(organizationId: string, branchId?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const snapshots = await this.prisma.kpiSnapshot.findMany({
      where: {
        organizationId,
        ...(branchId ? { branchId } : {}),
        periodType: 'DAILY',
        periodStart: { gte: today },
      },
    });

    const revenue = snapshots.find((s) => s.metricKey === 'total_revenue')?.valueNumeric || 0;
    const orderCount = snapshots.find((s) => s.metricKey === 'order_count')?.valueNumeric || 0;
    const avgTicket = orderCount > 0 ? revenue / orderCount : 0;
    
    // Top item mock or query from another KPI snapshot
    const topItem = snapshots.find((s) => s.metricKey === 'top_item')?.valueJson || { name: 'Unknown', qty: 0 };

    return {
      totalRevenue: revenue,
      orderCount,
      averageTicketSize: avgTicket,
      topItem,
    };
  }

  async getTrendData(organizationId: string, branchId?: string, days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const snapshots = await this.prisma.kpiSnapshot.findMany({
      where: {
        organizationId,
        ...(branchId ? { branchId } : {}),
        periodType: 'DAILY',
        periodStart: { gte: startDate },
        metricKey: { in: ['total_revenue', 'order_count'] },
      },
      orderBy: { periodStart: 'asc' },
    });

    return snapshots.map(s => ({
      date: s.periodStart.toISOString().split('T')[0],
      metric: s.metricKey,
      value: s.valueNumeric,
    }));
  }

  async getDailySummary(organizationId: string, date: string, branchId?: string) {
    const businessDate = new Date(date);
    return this.prisma.dailyBusinessSummary.findFirst({
      where: {
        organizationId,
        businessDate,
        ...(branchId ? { branchId } : {}),
      },
    });
  }
}
