import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PaymentService } from './payment.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  async listPayments() {
    return this.paymentService.listPayments();
  }

  @Get(':id')
  async getPayment(@Param('id') id: string) {
    const payment = await this.paymentService.getPayment(id);
    if (!payment) {
      throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
    }
    return payment;
  }
}
