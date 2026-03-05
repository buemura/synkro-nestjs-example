import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'processing',
  'completed',
  'failed',
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'processing',
  'completed',
  'failed',
]);

export const shipmentStatusEnum = pgEnum('shipment_status', [
  'pending',
  'in_transit',
  'delivered',
  'failed',
]);

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id')
    .notNull()
    .references(() => products.id),
  quantity: integer('quantity').notNull(),
  totalPrice: numeric('total_price', { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  status: paymentStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const importStatusEnum = pgEnum('import_status', [
  'pending',
  'processing',
  'completed',
  'failed',
]);

export const productImports = pgTable('product_imports', {
  id: uuid('id').primaryKey().defaultRandom(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  filePath: varchar('file_path', { length: 500 }).notNull(),
  status: importStatusEnum('status').notNull().default('pending'),
  totalRecords: integer('total_records'),
  processedRecords: integer('processed_records').default(0),
  errorMessage: varchar('error_message', { length: 1000 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const shipments = pgTable('shipments', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id),
  status: shipmentStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
