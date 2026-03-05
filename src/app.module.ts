import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SynkroModule } from '@synkro/nestjs';

import { DatabaseModule } from './database/database.module';
import { ImportModule } from './modules/import/import.module';
import { NotificationModule } from './modules/notification/notification.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ProductModule } from './modules/product/product.module';
import { ShipmentModule } from './modules/shipment/shipment.module';
import { workflows } from './modules/workflow/workflow.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    SynkroModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: 'redis',
        connectionUrl: config.get<string>('REDIS_URL'),
        workflows,
        debug: true,
      }),
    }),
    ProductModule,
    OrderModule,
    PaymentModule,
    ShipmentModule,
    ImportModule,
    NotificationModule,
  ],
})
export class AppModule {}
