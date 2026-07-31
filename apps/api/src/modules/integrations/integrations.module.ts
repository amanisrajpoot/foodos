import { Module } from '@nestjs/common';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
import { ExternalReferenceService } from './external-reference.service';
import { CashProvider } from './providers/payment/cash.provider';
import { RazorpayProvider } from './providers/payment/razorpay.provider';

@Module({
  controllers: [IntegrationsController],
  providers: [
    IntegrationsService,
    ExternalReferenceService,
    CashProvider,
    RazorpayProvider,
  ],
  exports: [
    IntegrationsService,
    ExternalReferenceService,
    CashProvider,
    RazorpayProvider,
  ],
})
export class IntegrationsModule {}
