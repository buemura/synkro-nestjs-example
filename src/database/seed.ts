import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { products } from './schema';

async function seed() {
  const pool = new Pool({
    connectionString:
      process.env.DATABASE_URL ??
      'postgresql://postgres:postgres@localhost:5432/ecommerce',
  });
  const db = drizzle(pool);

  console.log('Seeding products...');

  await db.insert(products).values([
    { name: 'Wireless Mouse', price: '29.99', stock: 100 },
    { name: 'Mechanical Keyboard', price: '89.99', stock: 50 },
    { name: 'USB-C Hub', price: '49.99', stock: 75 },
    { name: '27" Monitor', price: '349.99', stock: 20 },
    { name: 'Webcam HD', price: '69.99', stock: 40 },
  ]);

  console.log('Seeding complete.');
  await pool.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
