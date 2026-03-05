import { Module } from '@nestjs/common';

import { PaymentController } from './payment.controller';
import { PaymentEventHandler } from './payment-event.handler';
import { PaymentService } from './payment.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, PaymentEventHandler],
  exports: [PaymentService],
})
export class PaymentModule {}
