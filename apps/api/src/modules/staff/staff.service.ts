import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/providers/prisma/prisma.service';

@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService) {}

  async createEmployee(data: any) {
    return this.prisma.employee.create({ data });
  }

  async getEmployee(id: string) {
    return this.prisma.employee.findUnique({ where: { id } });
  }

  async getEmployees(organizationId: string) {
    return this.prisma.employee.findMany({ where: { organizationId } });
  }

  async updateEmployee(id: string, data: any) {
    return this.prisma.employee.update({ where: { id }, data });
  }
}
