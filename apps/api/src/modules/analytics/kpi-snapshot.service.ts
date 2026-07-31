import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/providers/prisma/prisma.service';

@Injectable()
export class KpiSnapshotService {
  private readonly logger = new Logger(KpiSnapshotService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Called by a cron job or external trigger to compute and save KPI snapshots.
   */
  async generateDailySnapshots(organizationId: string, branchId: string, date: Date) {
    this.logger.log(`Generating KPI snapshots for branch ${branchId} on ${date.toISOString()}`);
    
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Aggregate Orders
    const orders = await this.prisma.order.findMany({
      where: {
        organizationId,
        branchId,
        createdAt: { gte: startOfDay, lte: endOfDay },
        status: { notIn: ['CANCELLED', 'FAILED'] }
      }
    });

    const orderCount = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalMinor, 0);

    // Save Total Revenue KPI
    await this.prisma.kpiSnapshot.create({
      data: {
        organizationId,
        branchId,
        metricKey: 'total_revenue',
        domain: 'ORDERS',
        periodType: 'DAILY',
        periodStart: startOfDay,
        periodEnd: endOfDay,
        valueNumeric: totalRevenue / 100, // Converting minor to major for KPI display if needed, or keep minor
      }
    });

    // Save Order Count KPI
    await this.prisma.kpiSnapshot.create({
      data: {
        organizationId,
        branchId,
        metricKey: 'order_count',
        domain: 'ORDERS',
        periodType: 'DAILY',
        periodStart: startOfDay,
        periodEnd: endOfDay,
        valueNumeric: orderCount,
      }
    });

    // Mock Payments Aggregation
    const successPaymentsCount = Math.floor(orderCount * 0.9); 
    await this.prisma.kpiSnapshot.create({
      data: {
        organizationId,
        branchId,
        metricKey: 'payment_success_rate',
        domain: 'PAYMENTS',
        periodType: 'DAILY',
        periodStart: startOfDay,
        periodEnd: endOfDay,
        valueNumeric: orderCount > 0 ? (successPaymentsCount / orderCount) * 100 : 0,
      }
    });

    // Mock Inventory Aggregation
    await this.prisma.kpiSnapshot.create({
      data: {
        organizationId,
        branchId,
        metricKey: 'food_cost_percentage',
        domain: 'INVENTORY',
        periodType: 'DAILY',
        periodStart: startOfDay,
        periodEnd: endOfDay,
        valueNumeric: 28.5, // Dummy food cost %
      }
    });

    // Save Top Item KPI (Mocked for now, would typically group OrderItems)
    await this.prisma.kpiSnapshot.create({
      data: {
        organizationId,
        branchId,
        metricKey: 'top_item',
        domain: 'ORDERS',
        periodType: 'DAILY',
        periodStart: startOfDay,
        periodEnd: endOfDay,
        valueJson: { name: 'Butter Chicken', qty: Math.floor(Math.random() * 50) + 10 },
      }
    });

    this.logger.log(`Generated multiple KPIs for branch ${branchId}`);
  }
}
