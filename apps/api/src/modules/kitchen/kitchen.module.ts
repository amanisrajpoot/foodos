import { Module } from '@nestjs/common';
import { KitchenController } from './kitchen.controller';
import { KitchenService } from './kitchen.service';
import { PrismaModule } from '../../shared/providers/prisma/prisma.module';
import { PlatformModule } from '../platform/platform.module';

@Module({
  imports: [PrismaModule, PlatformModule],
  controllers: [KitchenController],
  providers: [KitchenService],
  exports: [KitchenService],
})
export class KitchenModule {}
