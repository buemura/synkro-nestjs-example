import { Inject, Injectable, Logger } from '@nestjs/common';
import type { HandlerCtx } from '@synkro/core';
import { OnWorkflowStep } from '@synkro/nestjs';
import * as fs from 'fs';
import * as path from 'path';

import { DATABASE, type Database } from '../../database/database.module';
import { products } from '../../database/schema';
import { ProductImportStep, WorkflowName } from '../workflow/workflow.enum';
import { ImportService } from './import.service';

type ImportPayload = {
  importId: string;
  fileName: string;
  fileBuffer: string; // base64-encoded file content
  filePath?: string;
  totalRecords?: number;
  processedRecords?: number;
};

@Injectable()
export class ImportEventHandler {
  private readonly logger = new Logger(ImportEventHandler.name);

  constructor(
    private readonly importService: ImportService,
    @Inject(DATABASE) private readonly db: Database,
  ) {}

  @OnWorkflowStep(WorkflowName.PRODUCT_IMPORT, ProductImportStep.SAVE_FILE)
  async handleSaveFile(ctx: HandlerCtx) {
    const payload = ctx.payload as ImportPayload;
    this.logger.log(`Saving file for import ${payload.importId}`);

    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, `${payload.importId}-${payload.fileName}`);
    const buffer = Buffer.from(payload.fileBuffer, 'base64');
    fs.writeFileSync(filePath, buffer);

    await this.importService.updateStatus(payload.importId, 'processing');

    ctx.setPayload({ ...payload, filePath, fileBuffer: undefined });
    this.logger.log(`File saved at ${filePath}`);
  }

  @OnWorkflowStep(
    WorkflowName.PRODUCT_IMPORT,
    ProductImportStep.PARSE_AND_INSERT,
  )
  async handleParseAndInsert(ctx: HandlerCtx) {
    const payload = ctx.payload as ImportPayload;
    this.logger.log(`Parsing CSV for import ${payload.importId}`);

    const fileContent = fs.readFileSync(payload.filePath!, 'utf-8');
    const lines = fileContent.split('\n').filter((line) => line.trim());

    // Skip header row
    const dataLines = lines.slice(1);
    const totalRecords = dataLines.length;

    const BATCH_SIZE = 500;
    let processedRecords = 0;

    for (let i = 0; i < dataLines.length; i += BATCH_SIZE) {
      const batch = dataLines.slice(i, i + BATCH_SIZE);
      const values = batch.map((line) => {
        const [name, price, stock] = line.split(',').map((v) => v.trim());
        return {
          name,
          price,
          stock: parseInt(stock, 10),
        };
      });

      await this.db.insert(products).values(values);
      processedRecords += values.length;

      this.logger.log(
        `Import ${payload.importId}: ${processedRecords}/${totalRecords} records inserted`,
      );
    }

    await this.importService.updateStatus(payload.importId, 'processing', {
      totalRecords,
      processedRecords,
    });

    ctx.setPayload({ ...payload, totalRecords, processedRecords });
    this.logger.log(`CSV parsing complete for import ${payload.importId}`);
  }

  @OnWorkflowStep(
    WorkflowName.PRODUCT_IMPORT,
    ProductImportStep.COMPLETE_IMPORT,
  )
  async handleCompleteImport(ctx: HandlerCtx) {
    const payload = ctx.payload as ImportPayload;
    this.logger.log(`Completing import ${payload.importId}`);

    await this.importService.updateStatus(payload.importId, 'completed', {
      totalRecords: payload.totalRecords,
      processedRecords: payload.processedRecords,
    });

    this.logger.log(
      `Import ${payload.importId} completed: ${payload.processedRecords}/${payload.totalRecords} records`,
    );
  }
}
