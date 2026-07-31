import { Module } from '@nestjs/common';
import { DeliveryService } from './services/delivery.service';
import { LocalFleetProvider } from './providers/local-fleet.provider';
import { DeliveryController } from './controllers/delivery.controller';
import { DeliveryGateway } from './gateways/delivery.gateway';

@Module({
  controllers: [DeliveryController],
  providers: [DeliveryService, LocalFleetProvider, DeliveryGateway],
  exports: [DeliveryService],
})
export class DeliveryModule {}
