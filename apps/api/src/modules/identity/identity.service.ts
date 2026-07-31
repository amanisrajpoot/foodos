import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/providers/prisma/prisma.service';

@Injectable()
export class IdentityService {
  constructor(private readonly prisma: PrismaService) {}

  // User CRUD
  async getUser(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
  async updateUser(id: string, data: any) {
    return this.prisma.user.update({ where: { id }, data });
  }

  // Membership invite/accept/suspend
  async inviteMember(data: any) {
    return this.prisma.membership.create({ data });
  }
  async acceptMembership(id: string) {
    return this.prisma.membership.update({
      where: { id },
      data: { status: 'ACTIVE', acceptedAt: new Date() },
    });
  }
  async suspendMembership(id: string) {
    return this.prisma.membership.update({
      where: { id },
      data: { status: 'SUSPENDED' },
    });
  }

  // Role Management
  async createRole(data: any) {
    return this.prisma.role.create({ data });
  }
  async getRoles(organizationId: string) {
    return this.prisma.role.findMany({ where: { organizationId } });
  }
}
