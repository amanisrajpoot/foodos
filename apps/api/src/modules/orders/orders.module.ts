import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PrismaModule } from '../../shared/providers/prisma/prisma.module';
import { PlatformModule } from '../platform/platform.module';
import { KitchenModule } from '../kitchen/kitchen.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { DeliveryModule } from '../delivery/delivery.module';

@Module({
  imports: [PrismaModule, PlatformModule, KitchenModule, NotificationsModule, DeliveryModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}

