import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/providers/prisma/prisma.service';

@Injectable()
export class AlertsService {
  constructor(private readonly prisma: PrismaService) {}

  async findActiveAlerts(organizationId: string, branchId: string) {
    return this.prisma.inventoryAlert.findMany({
      where: { organizationId, branchId, status: 'OPEN' },
      include: { ingredient: true },
    });
  }
}
