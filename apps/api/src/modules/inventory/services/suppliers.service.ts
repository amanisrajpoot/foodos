import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/providers/prisma/prisma.service';

@Injectable()
export class SuppliersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string) {
    return this.prisma.supplier.findMany({ where: { organizationId } });
  }

  async create(data: any) {
    return this.prisma.supplier.create({ data });
  }
}
