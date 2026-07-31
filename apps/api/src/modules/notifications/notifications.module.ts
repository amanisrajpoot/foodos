import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { PrismaModule } from '../../shared/providers/prisma/prisma.module';
import { PlatformModule } from '../platform/platform.module';

@Module({
  imports: [PrismaModule, PlatformModule],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
