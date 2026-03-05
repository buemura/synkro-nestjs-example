import { forwardRef, Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';
import { PaymentModule } from '../payment/payment.module';
import { ProductController } from './product.controller';
import { ProductEventHandler } from './product-event.handler';
import { ProductService } from './product.service';

@Module({
  imports: [forwardRef(() => OrderModule), forwardRef(() => PaymentModule)],
  controllers: [ProductController],
  providers: [ProductService, ProductEventHandler],
  exports: [ProductService],
})
export class ProductModule {}
