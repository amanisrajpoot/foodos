import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../shared/providers/prisma/prisma.service';
import { LocalFleetProvider } from '../providers/local-fleet.provider';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class DeliveryService {
  private readonly logger = new Logger(DeliveryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly localFleetProvider: LocalFleetProvider,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // --- Driver Onboarding & Management ---

  async onboardDriver(data: {
    organizationId: string;
    branchId: string;
    name: string;
    phone: string;
    email?: string;
    licenseNumber?: string;
    vehicleType?: string;
    vehicleNumber?: string;
    documentsJson?: any;
  }) {
    this.logger.log(`Onboarding new local driver ${data.name} for branch ${data.branchId}`);

    const existingDriver = await this.prisma.driver.findFirst({
      where: { organizationId: data.organizationId, phone: data.phone },
    });

    if (existingDriver) {
      throw new BadRequestException(`Driver with phone ${data.phone} is already registered.`);
    }

    const driver = await this.prisma.driver.create({
      data: {
        organizationId: data.organizationId,
        branchId: data.branchId,
        name: data.name,
        phone: data.phone,
        email: data.email,
        licenseNumber: data.licenseNumber,
        vehicleType: data.vehicleType || 'BIKE',
        vehicleNumber: data.vehicleNumber,
        documentsJson: data.documentsJson,
        status: 'INACTIVE',
        kycStatus: 'PENDING',
      },
    });

    this.eventEmitter.emit('delivery.driver.created.v1', driver);
    return driver;
  }

  async verifyDriverKyc(driverId: string, kycStatus: 'VERIFIED' | 'REJECTED') {
    const driver = await this.prisma.driver.findUnique({ where: { id: driverId } });
    if (!driver) throw new NotFoundException(`Driver ${driverId} not found`);

    return this.prisma.driver.update({
      where: { id: driverId },
      data: { kycStatus, status: kycStatus === 'VERIFIED' ? 'AVAILABLE' : 'INACTIVE' },
    });
  }

  async getDrivers(branchId: string, status?: string) {
    return this.prisma.driver.findMany({
      where: {
        branchId,
        ...(status ? { status } : {}),
      },
      include: {
        deliveryAssignments: {
          where: { status: { in: ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'] } },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getDriverProfile(driverId: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { id: driverId },
      include: {
        branch: true,
        deliveryAssignments: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { order: true },
        },
      },
    });
    if (!driver) throw new NotFoundException(`Driver ${driverId} not found`);
    return driver;
  }

  async updateDriverStatus(driverId: string, status: string) {
    const driver = await this.prisma.driver.findUnique({ where: { id: driverId } });
    if (!driver) throw new NotFoundException(`Driver ${driverId} not found`);

    const updated = await this.prisma.driver.update({
      where: { id: driverId },
      data: { status },
    });

    this.eventEmitter.emit('delivery.driver.status_changed.v1', updated);
    return updated;
  }

  async updateDriverLocation(driverId: string, latitude: number, longitude: number) {
    return this.prisma.driver.update({
      where: { id: driverId },
      data: {
        latitude,
        longitude,
        lastLocationAt: new Date(),
      },
    });
  }

  // --- 3P Delivery Partner Configurations & Auto-Dispatch ---

  async upsertPartnerConfig(branchId: string, organizationId: string, data: {
    provider: string;
    isEnabled: boolean;
    apiKey?: string;
    apiSecret?: string;
    merchantId?: string;
    webhookSecret?: string;
    autoDispatch?: boolean;
    priorityOrder?: number;
    maxDistanceKm?: number;
  }) {
    return this.prisma.deliveryPartnerConfig.upsert({
      where: { branchId_provider: { branchId, provider: data.provider } },
      update: { ...data },
      create: {
        ...data,
        organizationId,
        branchId,
      },
    });
  }

  async getPartnerConfigs(branchId: string) {
    return this.prisma.deliveryPartnerConfig.findMany({
      where: { branchId },
      orderBy: { priorityOrder: 'asc' },
    });
  }

  async evaluateAutoDispatch(orderId: string) {
    this.logger.log(`Evaluating auto-dispatch rules for order ${orderId}`);
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException(`Order ${orderId} not found`);

    const configs = await this.prisma.deliveryPartnerConfig.findMany({
      where: { branchId: order.branchId, isEnabled: true, autoDispatch: true },
      orderBy: { priorityOrder: 'asc' },
    });

    if (configs.length === 0) {
      this.logger.log(`No active auto-dispatch provider configs found for branch ${order.branchId}.`);
      return this.createDeliveryAssignment(orderId, 'LOCAL_FLEET');
    }

    for (const config of configs) {
      if (config.provider === 'LOCAL_FLEET') {
        const availableDriver = await this.prisma.driver.findFirst({
          where: { branchId: order.branchId, status: 'AVAILABLE', kycStatus: 'VERIFIED' },
        });

        if (availableDriver) {
          const assignment = await this.createDeliveryAssignment(orderId, 'LOCAL_FLEET');
          await this.assignDriver(assignment.id, availableDriver.id);
          return assignment;
        }
      } else {
        // External 3P Provider (Porter, Borzo, Shadowfax)
        return this.createDeliveryAssignment(orderId, config.provider);
      }
    }

    return this.createDeliveryAssignment(orderId, 'LOCAL_FLEET');
  }

  // --- Active Delivery Operations & Assignments ---

  async createDeliveryAssignment(orderId: string, providerType: string = 'LOCAL_FLEET') {
    this.logger.log(`Creating delivery assignment for order ${orderId} with provider ${providerType}`);

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true },
    });

    if (!order) throw new NotFoundException(`Order ${orderId} not found`);

    const customerAddress = await this.prisma.customerAddress.findFirst({
      where: { customerId: order.customerId || '00000000-0000-0000-0000-000000000000' },
      orderBy: { isDefault: 'desc' },
    });

    const assignment = await this.prisma.deliveryAssignment.create({
      data: {
        organizationId: order.organizationId,
        branchId: order.branchId,
        orderId: order.id,
        customerAddressId: customerAddress?.id,
        provider: providerType,
        status: 'PENDING',
      },
    });

    if (providerType === 'LOCAL_FLEET') {
      const taskResult = await this.localFleetProvider.createDeliveryTask({
        deliveryAssignmentId: assignment.id,
        organizationId: assignment.organizationId,
        branchId: assignment.branchId,
        orderId: assignment.orderId,
        pickupAddress: {},
        dropoffAddress: {
          addressLine1: customerAddress?.addressLine1 || 'Customer Address',
          latitude: customerAddress?.latitude ?? undefined,
          longitude: customerAddress?.longitude ?? undefined,
        },
      });

      await this.prisma.deliveryAssignment.update({
        where: { id: assignment.id },
        data: { providerTaskId: taskResult.providerTaskId },
      });
    }

    this.eventEmitter.emit('delivery.assignment.created.v1', assignment);
    return assignment;
  }

  async assignDriver(assignmentId: string, driverId: string) {
    const assignment = await this.prisma.deliveryAssignment.findUnique({ where: { id: assignmentId } });
    if (!assignment) throw new NotFoundException('Assignment not found');

    const driver = await this.prisma.driver.findUnique({ where: { id: driverId } });
    if (!driver) throw new NotFoundException('Driver not found');

    const updatedAssignment = await this.prisma.deliveryAssignment.update({
      where: { id: assignmentId },
      data: { driverId, status: 'ASSIGNED' },
    });

    await this.prisma.driver.update({
      where: { id: driverId },
      data: { status: 'ASSIGNED' },
    });

    await this.recordEvent(assignmentId, 'ASSIGNED', 'LOCAL', `Driver ${driver.name} assigned`);
    this.eventEmitter.emit('delivery.assignment.assigned.v1', updatedAssignment);

    return updatedAssignment;
  }

  async updateDeliveryStatus(assignmentId: string, status: string, latitude?: number, longitude?: number) {
    const assignment = await this.prisma.deliveryAssignment.update({
      where: { id: assignmentId },
      data: {
        status,
        deliveredAt: status === 'DELIVERED' ? new Date() : undefined,
      },
    });

    if (['DELIVERED', 'FAILED', 'CANCELLED'].includes(status)) {
      if (assignment.driverId) {
        await this.prisma.driver.update({
          where: { id: assignment.driverId },
          data: { status: 'AVAILABLE' },
        });
      }
    }

    await this.recordEvent(assignmentId, status, 'LOCAL', `Status updated to ${status}`, latitude, longitude);
    this.eventEmitter.emit(`delivery.assignment.${status.toLowerCase()}.v1`, assignment);

    return assignment;
  }

  private async recordEvent(
    assignmentId: string,
    eventType: string,
    eventSource: string,
    message: string,
    latitude?: number,
    longitude?: number,
  ) {
    const assignment = await this.prisma.deliveryAssignment.findUnique({ where: { id: assignmentId } });
    if (!assignment) return;

    await this.prisma.deliveryEvent.create({
      data: {
        organizationId: assignment.organizationId,
        deliveryAssignmentId: assignmentId,
        eventType,
        eventSource,
        message,
        latitude,
        longitude,
      },
    });
  }

  async getActiveDeliveries(branchId: string) {
    return this.prisma.deliveryAssignment.findMany({
      where: {
        branchId,
        status: { in: ['PENDING', 'ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'] },
      },
      include: {
        driver: true,
        order: { include: { customer: true } },
        customerAddress: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDriverAssignments(driverId: string) {
    return this.prisma.deliveryAssignment.findMany({
      where: {
        driverId,
        status: { in: ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'] },
      },
      include: {
        order: { include: { items: true, customer: true } },
        customerAddress: true,
      },
    });
  }
}
