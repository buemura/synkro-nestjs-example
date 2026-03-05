import { Inject, Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';

import { DATABASE, type Database } from '../../database/database.module';
import { products } from '../../database/schema';

@Injectable()
export class ProductService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async listProducts() {
    return this.db.select().from(products);
  }

  async getProduct(productId: string) {
    const [product] = await this.db
      .select()
      .from(products)
      .where(eq(products.id, productId));
    return product ?? null;
  }

  async hasStock(productId: string, quantity: number): Promise<boolean> {
    const product = await this.getProduct(productId);
    if (!product) return false;
    return product.stock >= quantity;
  }

  async reduceStock(productId: string, quantity: number) {
    await this.db
      .update(products)
      .set({ stock: sql`${products.stock} - ${quantity}`, updatedAt: new Date() })
      .where(eq(products.id, productId));
  }

  async restoreStock(productId: string, quantity: number) {
    await this.db
      .update(products)
      .set({ stock: sql`${products.stock} + ${quantity}`, updatedAt: new Date() })
      .where(eq(products.id, productId));
  }
}
