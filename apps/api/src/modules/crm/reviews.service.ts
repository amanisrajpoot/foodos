import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/providers/prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(data: {
    organizationId: string;
    customerId: string;
    orderId?: string;
    rating: number;
    comment?: string;
    reviewSource?: string;
  }) {
    return this.prisma.review.create({
      data,
    });
  }

  async getCustomerReviews(customerId: string, organizationId: string) {
    return this.prisma.review.findMany({
      where: { customerId, organizationId },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async moderateReview(id: string, organizationId: string, status: string) {
    return this.prisma.review.update({
      where: { id, organizationId },
      data: { status },
    });
  }
}
