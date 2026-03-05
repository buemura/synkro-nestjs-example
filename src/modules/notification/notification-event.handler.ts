import { Injectable, Logger } from '@nestjs/common';
import type { HandlerCtx } from '@synkro/core';
import { OnWorkflowStep } from '@synkro/nestjs';

import { ProductImportStep, WorkflowName } from '../workflow/workflow.enum';
import { NotificationService } from './notification.service';

type ImportPayload = {
  importId: string;
  fileName: string;
  totalRecords: number;
  processedRecords: number;
};

@Injectable()
export class NotificationEventHandler {
  private readonly logger = new Logger(NotificationEventHandler.name);

  constructor(private readonly notificationService: NotificationService) {}

  @OnWorkflowStep(WorkflowName.PRODUCT_IMPORT, ProductImportStep.NOTIFY_USER)
  async handleNotifyUser(ctx: HandlerCtx) {
    const payload = ctx.payload as ImportPayload;
    this.logger.log(`Sending notification for import ${payload.importId}`);

    await this.notificationService.notifyImportComplete({
      importId: payload.importId,
      fileName: payload.fileName,
      totalRecords: payload.totalRecords,
      processedRecords: payload.processedRecords,
    });

    this.logger.log(`Notification sent for import ${payload.importId}`);
  }
}
