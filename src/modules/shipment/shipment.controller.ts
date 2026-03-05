import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ShipmentService } from './shipment.service';

@ApiTags('Shipments')
@Controller('shipments')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Get()
  async listShipments() {
    return this.shipmentService.listShipments();
  }

  @Get(':id')
  async getShipment(@Param('id') id: string) {
    const shipment = await this.shipmentService.getShipment(id);
    if (!shipment) {
      throw new HttpException('Shipment not found', HttpStatus.NOT_FOUND);
    }
    return shipment;
  }
}
