import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('customers/:customerId/wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('adjust')
  async adjustBalance(
    @Param('customerId') customerId: string,
    @Body() data: any,
  ) {
    return this.walletService.adjustBalance({ ...data, customerId });
  }

  @Get('transactions')
  async getTransactions(
    @Param('customerId') customerId: string,
    @Query('organizationId') organizationId: string,
  ) {
    return this.walletService.getWalletTransactions(customerId, organizationId);
  }

  @Get('balance')
  async getBalance(
    @Param('customerId') customerId: string,
    @Query('organizationId') organizationId: string,
  ) {
    return this.walletService.getBalance(customerId, organizationId);
  }
}
