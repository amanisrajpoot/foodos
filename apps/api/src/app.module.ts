import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './shared/providers/prisma/prisma.module';

import { AuthModule } from './modules/auth/auth.module';
import { IdentityModule } from './modules/identity/identity.module';
import { RestaurantModule } from './modules/restaurant/restaurant.module';
import { StaffModule } from './modules/staff/staff.module';
import { PlatformModule } from './modules/platform/platform.module';
import { FinanceModule } from './modules/finance/finance.module';
import { MenuModule } from './modules/menu/menu.module';
import { OrdersModule } from './modules/orders/orders.module';
import { KitchenModule } from './modules/kitchen/kitchen.module';
import { WebSocketsModule } from './modules/websockets/websockets.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { CrmModule } from './modules/crm/crm.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    PrismaModule,
    AuthModule,
    IdentityModule,
    RestaurantModule,
    StaffModule,
    PlatformModule,
    FinanceModule,
    MenuModule,
    OrdersModule,
    KitchenModule,
    WebSocketsModule,
    NotificationsModule,
    InventoryModule,
    PaymentsModule,
    IntegrationsModule,
    CrmModule,
    DeliveryModule,
    AnalyticsModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
