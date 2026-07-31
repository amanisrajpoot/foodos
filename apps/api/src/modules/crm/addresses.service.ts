import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/providers/prisma/prisma.service';
import { StubMapsProvider } from '../platform/providers/maps.provider';

@Injectable()
export class AddressesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapsProvider: StubMapsProvider,
  ) {}

  async createAddress(data: {
    organizationId: string;
    customerId: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state?: string;
    postalCode: string;
    countryCode: string;
    deliveryInstructions?: string;
  }) {
    const geocode = await this.mapsProvider.geocode(data);
    const latitude = geocode.latitude;
    const longitude = geocode.longitude;

    return this.prisma.customerAddress.create({
      data: {
        ...data,
        latitude,
        longitude,
      },
    });
  }

  async getCustomerAddresses(customerId: string, organizationId: string) {
    return this.prisma.customerAddress.findMany({
      where: { customerId, organizationId, status: 'ACTIVE' },
    });
  }

  async deleteAddress(id: string, organizationId: string) {
    return this.prisma.customerAddress.update({
      where: { id, organizationId },
      data: { status: 'ARCHIVED' },
    });
  }
}
