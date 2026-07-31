import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const Permissions = (...permissions: string[]) => {
  return (target: any, key?: string | symbol, descriptor?: any) => {
    Reflector.createDecorator<string[]>()(permissions)(
      target,
      key as string | symbol,
      descriptor,
    );
  };
};

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!requiredPermissions) {
      return true; // No permissions required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Placeholder logic for RBAC check
    // Real implementation would look up `request.organizationId`, load the user's
    // roles for that organization, and verify permissions.

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Example naive bypass for development:
    // return true;

    return true; // Allowing everything temporarily for initial scaffolding
  }
}
