import { Module } from '@nestjs/common';

import { ImportController } from './import.controller';
import { ImportEventHandler } from './import-event.handler';
import { ImportService } from './import.service';

@Module({
  controllers: [ImportController],
  providers: [ImportService, ImportEventHandler],
  exports: [ImportService],
})
export class ImportModule {}
