import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('organization/:organizationId')
  getPaymentsByOrg(@Param('organizationId') organizationId: string) {
    return this.paymentsService.getPaymentsByOrg(organizationId);
  }

  @Post('initiate')
  initiatePayment(@Body() data: any) {
    return this.paymentsService.initiatePayment(data);
  }

  @Post('capture/:paymentId')
  capturePayment(
    @Param('paymentId') paymentId: string,
    @Body('amountMinor') amountMinor: number,
  ) {
    return this.paymentsService.capturePayment(paymentId, amountMinor);
  }
}
