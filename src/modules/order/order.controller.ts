import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { SynkroService } from '@synkro/nestjs';
import { IsInt, IsUUID, Min } from 'class-validator';

import { ProductService } from '../product/product.service';
import { WorkflowName } from '../workflow/workflow.enum';
import { OrderService } from './order.service';

class CreateOrderDto {
  @ApiProperty({
    description: 'Product UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({ description: 'Quantity to order', example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
    private readonly synkroService: SynkroService,
  ) {}

  @Get()
  async listOrders() {
    return this.orderService.listOrders();
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    const order = await this.orderService.getOrder(id);
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    return order;
  }

  @Post()
  async createOrder(@Body() body: CreateOrderDto) {
    // SYNC: Check product stock
    const product = await this.productService.getProduct(body.productId);
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    const hasStock = await this.productService.hasStock(
      body.productId,
      body.quantity,
    );
    if (!hasStock) {
      throw new HttpException('Insufficient stock', HttpStatus.BAD_REQUEST);
    }

    // SYNC: Create order
    const totalPrice = (Number(product.price) * body.quantity).toFixed(2);
    const order = await this.orderService.createOrder({
      productId: body.productId,
      quantity: body.quantity,
      totalPrice,
    });

    // ASYNC: Trigger the order-processing workflow
    await this.synkroService.publish(WorkflowName.ORDER_PROCESSING, {
      orderId: order.id,
      productId: body.productId,
      quantity: body.quantity,
      totalPrice,
    });

    return { message: 'Order created successfully', order };
  }
}
