import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../shared/providers/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;

    // Only audit mutations
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle().pipe(
        tap(async (data) => {
          try {
            const user = (request as any).user;
            const organizationId = (request as any).organizationId;

            // In a real scenario, entityId and entityType would be extracted from the route or response data
            await this.prisma.auditLog.create({
              data: {
                organizationId:
                  organizationId || '00000000-0000-0000-0000-000000000000', // fallback for demo
                actorUserId: user?.id,
                actorType: user ? 'USER' : 'SYSTEM',
                action: method,
                entityType: request.path.split('/')[1] || 'unknown',
                entityId: data?.id || '00000000-0000-0000-0000-000000000000',
                beforeJson: {},
                afterJson: data || {},
                ipAddress: request.ip,
                userAgent: request.headers['user-agent'],
              },
            });
          } catch (e) {
            console.error('Failed to write audit log', e);
          }
        }),
      );
    }

    return next.handle();
  }
}
