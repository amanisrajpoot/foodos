import { Module } from '@nestjs/common';
import { PrismaModule } from '../../shared/providers/prisma/prisma.module';
import { PlatformModule } from '../platform/platform.module';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  imports: [PrismaModule, PlatformModule],
  controllers: [
    CustomersController,
    AddressesController,
    ReviewsController,
    WalletController,
  ],
  providers: [
    CustomersService,
    AddressesService,
    ReviewsService,
    WalletService,
  ],
  exports: [CustomersService],
})
export class CrmModule {}
