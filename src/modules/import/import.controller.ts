import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SynkroService } from '@synkro/nestjs';

import { WorkflowName } from '../workflow/workflow.enum';
import { ImportService } from './import.service';

@ApiTags('Imports')
@Controller('imports')
export class ImportController {
  constructor(
    private readonly importService: ImportService,
    private readonly synkroService: SynkroService,
  ) {}

  @Get()
  async listImports() {
    return this.importService.listImports();
  }

  @Get(':id')
  async getImport(@Param('id') id: string) {
    const record = await this.importService.getImport(id);
    if (!record) {
      throw new HttpException('Import not found', HttpStatus.NOT_FOUND);
    }
    return record;
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  async uploadProducts(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    }

    if (!file.originalname.endsWith('.csv')) {
      throw new HttpException(
        'Only CSV files are allowed',
        HttpStatus.BAD_REQUEST,
      );
    }

    // SYNC: Create import record with pending status
    const importRecord = await this.importService.createImport({
      fileName: file.originalname,
      filePath: 'pending',
    });

    // ASYNC: Trigger the product-import workflow
    await this.synkroService.publish(WorkflowName.PRODUCT_IMPORT, {
      importId: importRecord.id,
      fileName: file.originalname,
      fileBuffer: file.buffer.toString('base64'),
    });

    return { message: 'Product import started', import: importRecord };
  }
}
