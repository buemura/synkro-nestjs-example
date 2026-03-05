import { Injectable, Logger } from '@nestjs/common';
import type { HandlerCtx } from '@synkro/core';
import { OnWorkflowStep } from '@synkro/nestjs';

import { OrderProcessingStep, WorkflowName } from '../workflow/workflow.enum';
import { PaymentService } from './payment.service';

type OrderPayload = {
  orderId: string;
  productId: string;
  quantity: number;
  totalPrice: string;
  paymentId?: string;
};

@Injectable()
export class PaymentEventHandler {
  private readonly logger = new Logger(PaymentEventHandler.name);

  constructor(private readonly paymentService: PaymentService) {}

  @OnWorkflowStep(
    WorkflowName.ORDER_PROCESSING,
    OrderProcessingStep.CREATE_PAYMENT,
  )
  async handleCreatePayment(ctx: HandlerCtx) {
    const payload = ctx.payload as OrderPayload;
    this.logger.log(`Creating payment for order ${payload.orderId}`);

    const payment = await this.paymentService.createPayment(
      payload.orderId,
      payload.totalPrice,
    );

    this.logger.log(
      `Payment ${payment.id} created for order ${payload.orderId}`,
    );
    ctx.setPayload({ ...payload, paymentId: payment.id });
  }

  @OnWorkflowStep(
    WorkflowName.ORDER_PROCESSING,
    OrderProcessingStep.PROCESS_PAYMENT,
  )
  async handleProcessPayment(ctx: HandlerCtx) {
    const payload = ctx.payload as OrderPayload;
    this.logger.log(`Processing payment for order ${payload.orderId}`);

    // Simulate payment processing (randomly fail 20% of the time)
    const success = Math.random() > 0.2;

    if (!success) {
      if (payload.paymentId) {
        await this.paymentService.updateStatus(payload.paymentId, 'failed');
      }
      throw new Error(`Payment processing failed for order ${payload.orderId}`);
    }

    if (payload.paymentId) {
      await this.paymentService.updateStatus(payload.paymentId, 'completed');
    }

    this.logger.log(
      `Payment processed successfully for order ${payload.orderId}`,
    );
  }
}
