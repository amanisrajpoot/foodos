import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { IntegrationsModule } from '../integrations/integrations.module';
import { FinanceModule } from '../finance/finance.module';

@Module({
  imports: [IntegrationsModule, FinanceModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
