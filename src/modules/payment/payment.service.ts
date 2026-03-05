import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { DATABASE, type Database } from '../../database/database.module';
import { payments } from '../../database/schema';

@Injectable()
export class PaymentService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async createPayment(orderId: string, amount: string) {
    const [payment] = await this.db
      .insert(payments)
      .values({ orderId, amount, status: 'pending' })
      .returning();
    return payment;
  }

  async updateStatus(paymentId: string, status: 'processing' | 'completed' | 'failed') {
    await this.db
      .update(payments)
      .set({ status, updatedAt: new Date() })
      .where(eq(payments.id, paymentId));
  }

  async listPayments() {
    return this.db.select().from(payments);
  }

  async getPayment(paymentId: string) {
    const [payment] = await this.db
      .select()
      .from(payments)
      .where(eq(payments.id, paymentId));
    return payment ?? null;
  }

  async getPaymentByOrderId(orderId: string) {
    const [payment] = await this.db
      .select()
      .from(payments)
      .where(eq(payments.orderId, orderId));
    return payment ?? null;
  }
}
