import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  async notifyImportComplete(data: {
    importId: string;
    fileName: string;
    totalRecords: number;
    processedRecords: number;
  }) {
    // In a real app, this would send an email, push notification, websocket event, etc.
    this.logger.log(
      `[NOTIFICATION] Product import "${data.fileName}" completed: ${data.processedRecords}/${data.totalRecords} records imported (import ID: ${data.importId})`,
    );
  }
}
