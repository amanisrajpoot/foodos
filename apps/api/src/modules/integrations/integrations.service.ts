import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/providers/prisma/prisma.service';

@Injectable()
export class IntegrationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getProviders(organizationId: string) {
    return this.prisma.integrationProviderConfig.findMany({
      where: { organizationId },
    });
  }

  async createProvider(organizationId: string, data: any) {
    return this.prisma.integrationProviderConfig.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  async handleWebhook(providerKey: string, payload: any) {
    // In a real implementation, find the provider config and verify signature
    // Then create a WebhookEvent and process it based on event type
    return { status: 'RECEIVED' };
  }
}
