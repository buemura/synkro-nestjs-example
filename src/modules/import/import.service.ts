import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { DATABASE, type Database } from '../../database/database.module';
import { productImports } from '../../database/schema';

@Injectable()
export class ImportService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async createImport(data: { fileName: string; filePath: string }) {
    const [record] = await this.db
      .insert(productImports)
      .values(data)
      .returning();
    return record;
  }

  async updateStatus(
    importId: string,
    status: 'pending' | 'processing' | 'completed' | 'failed',
    extra?: {
      totalRecords?: number;
      processedRecords?: number;
      errorMessage?: string;
    },
  ) {
    await this.db
      .update(productImports)
      .set({ status, ...extra, updatedAt: new Date() })
      .where(eq(productImports.id, importId));
  }

  async getImport(importId: string) {
    const [record] = await this.db
      .select()
      .from(productImports)
      .where(eq(productImports.id, importId));
    return record ?? null;
  }

  async listImports() {
    return this.db.select().from(productImports);
  }
}
