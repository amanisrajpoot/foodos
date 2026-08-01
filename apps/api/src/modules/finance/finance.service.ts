import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/providers/prisma/prisma.service';

@Injectable()
export class FinanceService {
  private readonly logger = new Logger(FinanceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createTaxCategory(data: any) {
    return this.prisma.taxCategory.create({ data });
  }

  async getTaxCategories(organizationId: string) {
    return this.prisma.taxCategory.findMany({ where: { organizationId } });
  }

  async updateTaxCategory(id: string, data: any) {
    return this.prisma.taxCategory.update({
      where: { id },
      data,
    });
  }

  async deleteTaxCategory(id: string) {
    return this.prisma.taxCategory.delete({ where: { id } });
  }

  async getInvoices(organizationId: string) {
    return this.prisma.invoice.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      include: { order: true },
    });
  }

  async getInvoiceById(id: string) {
    return this.prisma.invoice.findUnique({
      where: { id },
      include: { order: { include: { items: true } } },
    });
  }

  async generateInvoice(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, branch: true, organization: true },
    });

    if (!order) throw new NotFoundException('Order not found');

    // Check if invoice already exists
    const existing = await this.prisma.invoice.findUnique({
      where: { orderId },
    });
    if (existing) return existing;

    const invoiceNumber = `INV-${Date.now()}`;

    // In a real scenario we'd generate a PDF and upload to S3 here.
    // For now we'll set a placeholder pdfUrl that points to an endpoint we will build.
    const pdfUrl = `/api/v1/finance/invoices/${invoiceNumber}/pdf`;

    return this.prisma.invoice.create({
      data: {
        organizationId: order.organizationId,
        branchId: order.branchId,
        orderId: order.id,
        invoiceNumber,
        status: 'ISSUED',
        subtotalMinor: order.subtotalMinor,
        discountMinor: order.discountMinor,
        taxMinor: order.taxMinor,
        totalMinor: order.totalMinor,
        currency: order.currency,
        issuedAt: new Date(),
        pdfUrl,
      },
    });
  }
}
