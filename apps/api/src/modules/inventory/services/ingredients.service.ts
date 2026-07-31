import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/providers/prisma/prisma.service';

@Injectable()
export class IngredientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string) {
    return this.prisma.ingredient.findMany({ where: { organizationId } });
  }

  async findOne(id: string) {
    return this.prisma.ingredient.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.ingredient.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.ingredient.update({ where: { id }, data });
  }
}
