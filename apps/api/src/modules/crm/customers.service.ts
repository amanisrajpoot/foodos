import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/providers/prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async createCustomer(data: {
    organizationId: string;
    restaurantId?: string;
    fullName: string;
    phone?: string;
    email?: string;
  }) {
    return this.prisma.customer.create({
      data,
    });
  }

  async getCustomer(id: string, organizationId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id, organizationId },
      include: {
        addresses: true,
        orders: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async searchCustomers(organizationId: string, query: string) {
    return this.prisma.customer.findMany({
      where: {
        organizationId,
        OR: [
          { phone: { contains: query, mode: 'insensitive' } },
          { fullName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { orderCount: 'desc' },
    });
  }

  async getCustomers(organizationId: string) {
    return this.prisma.customer.findMany({
      where: { organizationId },
      orderBy: { lastOrderAt: 'desc' },
    });
  }
}
