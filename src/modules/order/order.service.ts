import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { DATABASE, type Database } from '../../database/database.module';
import { orders } from '../../database/schema';

@Injectable()
export class OrderService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async createOrder(data: {
    productId: string;
    quantity: number;
    totalPrice: string;
  }) {
    const [order] = await this.db
      .insert(orders)
      .values({
        productId: data.productId,
        quantity: data.quantity,
        totalPrice: data.totalPrice,
        status: 'pending',
      })
      .returning();
    return order;
  }

  async updateStatus(orderId: string, status: 'processing' | 'completed' | 'failed') {
    await this.db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, orderId));
  }

  async listOrders() {
    return this.db.select().from(orders);
  }

  async getOrder(orderId: string) {
    const [order] = await this.db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId));
    return order ?? null;
  }
}
