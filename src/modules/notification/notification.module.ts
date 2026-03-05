import { Module } from '@nestjs/common';

import { NotificationEventHandler } from './notification-event.handler';
import { NotificationService } from './notification.service';

@Module({
  providers: [NotificationService, NotificationEventHandler],
  exports: [NotificationService],
})
export class NotificationModule {}
