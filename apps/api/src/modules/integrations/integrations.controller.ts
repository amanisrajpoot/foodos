import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { IntegrationsService } from './integrations.service';

@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get('providers/:organizationId')
  getProviders(@Param('organizationId') organizationId: string) {
    return this.integrationsService.getProviders(organizationId);
  }

  @Post('providers/:organizationId')
  createProvider(
    @Param('organizationId') organizationId: string,
    @Body() data: any,
  ) {
    return this.integrationsService.createProvider(organizationId, data);
  }

  @Post('webhooks/:providerKey')
  handleWebhook(
    @Param('providerKey') providerKey: string,
    @Body() payload: any,
  ) {
    return this.integrationsService.handleWebhook(providerKey, payload);
  }
}
