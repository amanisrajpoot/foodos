import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { getAuth } from '../../modules/auth/auth';

@Injectable()
export class TenantGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const auth = await getAuth();
    // Validate session with Better Auth
    const session = await auth.api.getSession({
      headers: request.headers as HeadersInit,
    });

    if (!session || !session.user) {
      throw new UnauthorizedException('Authentication required');
    }

    // Attach user to request
    (request as any).user = session.user;

    // In a real implementation, you would also fetch the user's active membership
    // or expect organizationId in the header (e.g. x-organization-id)
    const organizationId = request.headers['x-organization-id'] as string;
    if (organizationId) {
      (request as any).organizationId = organizationId;
    }

    return true;
  }
}
