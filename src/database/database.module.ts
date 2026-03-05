import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema';

export const DATABASE = Symbol('DATABASE');
export type Database = NodePgDatabase<typeof schema>;

@Global()
@Module({
  providers: [
    {
      provide: DATABASE,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const pool = new Pool({
          connectionString:
            config.get<string>('DATABASE_URL') ??
            'postgresql://postgres:postgres@localhost:5432/ecommerce',
        });
        return drizzle(pool, { schema });
      },
    },
  ],
  exports: [DATABASE],
})
export class DatabaseModule {}
