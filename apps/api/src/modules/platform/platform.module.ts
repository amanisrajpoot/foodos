import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditInterceptor } from './audit.interceptor';
import { PrismaModule } from '../../shared/providers/prisma/prisma.module';
import { OutboxPublisherService } from './outbox-publisher.service';
import { StubMapsProvider } from './providers/maps.provider';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
    OutboxPublisherService,
    StubMapsProvider,
  ],
  exports: [OutboxPublisherService, StubMapsProvider],
})
export class PlatformModule {}
