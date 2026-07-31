import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { IdentityService } from './identity.service';
import { TenantGuard } from '../../shared/guards/tenant.guard';
import { RbacGuard, Permissions } from '../../shared/guards/rbac.guard';

@Controller('identity')
@UseGuards(TenantGuard, RbacGuard)
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    return this.identityService.getUser(id);
  }

  @Post('memberships/invite')
  @Permissions('identity.membership.invite')
  async inviteMember(@Body() body: any) {
    return this.identityService.inviteMember(body);
  }

  @Post('memberships/:id/accept')
  async acceptMembership(@Param('id') id: string) {
    return this.identityService.acceptMembership(id);
  }

  @Post('memberships/:id/suspend')
  @Permissions('identity.membership.update')
  async suspendMembership(@Param('id') id: string) {
    return this.identityService.suspendMembership(id);
  }

  @Post('roles')
  @Permissions('identity.role.manage')
  async createRole(@Body() body: any) {
    return this.identityService.createRole(body);
  }

  @Get('roles/:orgId')
  @Permissions('identity.role.read')
  async getRoles(@Param('orgId') orgId: string) {
    return this.identityService.getRoles(orgId);
  }
}
