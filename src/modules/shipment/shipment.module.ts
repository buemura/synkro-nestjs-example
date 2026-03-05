import { Module } from '@nestjs/common';

import { ShipmentController } from './shipment.controller';
import { ShipmentEventHandler } from './shipment-event.hanlder';
import { ShipmentService } from './shipment.service';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [OrderModule],
  controllers: [ShipmentController],
  providers: [ShipmentService, ShipmentEventHandler],
  exports: [ShipmentService],
})
export class ShipmentModule {}
