import { Injectable, Logger } from '@nestjs/common';
import type { HandlerCtx } from '@synkro/core';
import { OnWorkflowStep } from '@synkro/nestjs';

import { OrderService } from '../order/order.service';
import { OrderProcessingStep, WorkflowName } from '../workflow/workflow.enum';
import { ShipmentService } from './shipment.service';

type OrderPayload = {
  orderId: string;
  productId: string;
  quantity: number;
  totalPrice: string;
};

@Injectable()
export class ShipmentEventHandler {
  private readonly logger = new Logger(ShipmentEventHandler.name);

  constructor(
    private readonly shipmentService: ShipmentService,
    private readonly orderService: OrderService,
  ) {}

  @OnWorkflowStep(
    WorkflowName.ORDER_PROCESSING,
    OrderProcessingStep.START_SHIPPING,
  )
  async handleStartShipping(ctx: HandlerCtx) {
    const payload = ctx.payload as OrderPayload;
    this.logger.log(`Starting shipment for order ${payload.orderId}`);

    const shipment = await this.shipmentService.createShipment(payload.orderId);
    await this.shipmentService.updateStatus(shipment.id, 'in_transit');
    await this.orderService.updateStatus(payload.orderId, 'processing');

    this.logger.log(
      `Shipment ${shipment.id} started for order ${payload.orderId}`,
    );
    ctx.setPayload({ ...payload, shipmentId: shipment.id });
  }

  @OnWorkflowStep(
    WorkflowName.ORDER_PROCESSING,
    OrderProcessingStep.COMPLETE_SHIPPING,
  )
  async handleCompleteShipping(ctx: HandlerCtx) {
    const payload = ctx.payload as OrderPayload & { shipmentId?: string };
    this.logger.log(`Completing shipment for order ${payload.orderId}`);

    if (payload.shipmentId) {
      await this.shipmentService.updateStatus(payload.shipmentId, 'delivered');
    }
    await this.orderService.updateStatus(payload.orderId, 'completed');

    this.logger.log(`Order ${payload.orderId} completed and delivered`);
  }
}
