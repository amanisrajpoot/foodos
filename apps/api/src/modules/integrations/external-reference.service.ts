import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/providers/prisma/prisma.service';

@Injectable()
export class ExternalReferenceService {
  constructor(private readonly prisma: PrismaService) {}

  async createReference(data: any) {
    return this.prisma.externalReference.create({ data });
  }

  async getReference(
    providerKey: string,
    entityType: string,
    entityId: string,
  ) {
    return this.prisma.externalReference.findFirst({
      where: {
        providerKey,
        entityType,
        entityId,
      },
    });
  }

  async getByExternalId(providerKey: string, externalId: string) {
    return this.prisma.externalReference.findFirst({
      where: {
        providerKey,
        externalId,
      },
    });
  }
}
