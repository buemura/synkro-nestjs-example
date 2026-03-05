import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { DATABASE, type Database } from '../../database/database.module';
import { shipments } from '../../database/schema';

@Injectable()
export class ShipmentService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async createShipment(orderId: string) {
    const [shipment] = await this.db
      .insert(shipments)
      .values({ orderId, status: 'pending' })
      .returning();
    return shipment;
  }

  async updateStatus(
    shipmentId: string,
    status: 'in_transit' | 'delivered' | 'failed',
  ) {
    await this.db
      .update(shipments)
      .set({ status, updatedAt: new Date() })
      .where(eq(shipments.id, shipmentId));
  }

  async listShipments() {
    return this.db.select().from(shipments);
  }

  async getShipment(shipmentId: string) {
    const [shipment] = await this.db
      .select()
      .from(shipments)
      .where(eq(shipments.id, shipmentId));
    return shipment ?? null;
  }

  async getShipmentByOrderId(orderId: string) {
    const [shipment] = await this.db
      .select()
      .from(shipments)
      .where(eq(shipments.orderId, orderId));
    return shipment ?? null;
  }
}
