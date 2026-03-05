import { Injectable, Logger } from '@nestjs/common';
import type { HandlerCtx } from '@synkro/core';
import { OnWorkflowStep } from '@synkro/nestjs';

import { OrderService } from '../order/order.service';
import { PaymentService } from '../payment/payment.service';
import { OrderProcessingStep, WorkflowName } from '../workflow/workflow.enum';
import { ProductService } from './product.service';

type OrderPayload = {
  orderId: string;
  productId: string;
  quantity: number;
  totalPrice: string;
  paymentId?: string;
};

@Injectable()
export class ProductEventHandler {
  private readonly logger = new Logger(ProductEventHandler.name);

  constructor(
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
  ) {}

  @OnWorkflowStep(
    WorkflowName.ORDER_PROCESSING,
    OrderProcessingStep.REDUCE_STOCK,
  )
  async handleReduceStock(ctx: HandlerCtx) {
    const payload = ctx.payload as OrderPayload;
    this.logger.log(
      `Reducing stock for product ${payload.productId} by ${payload.quantity}`,
    );
    await this.productService.reduceStock(payload.productId, payload.quantity);
    this.logger.log(
      `Stock reduced successfully for product ${payload.productId}`,
    );
  }

  @OnWorkflowStep(
    WorkflowName.ORDER_PROCESSING,
    OrderProcessingStep.PAYMENT_FAILED,
  )
  async handlePaymentFailed(ctx: HandlerCtx) {
    const payload = ctx.payload as OrderPayload;
    this.logger.log(`Payment failed - rolling back order ${payload.orderId}`);

    await this.productService.restoreStock(payload.productId, payload.quantity);
    await this.orderService.updateStatus(payload.orderId, 'failed');
    if (payload.paymentId) {
      await this.paymentService.updateStatus(payload.paymentId, 'failed');
    }

    this.logger.log(`Rollback complete for order ${payload.orderId}`);
  }
}
