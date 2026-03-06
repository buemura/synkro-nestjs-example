# Synkro NestJS Example

An event-driven ecommerce API built with [NestJS](https://nestjs.com) and [Synkro](https://github.com/buemura/synkro) — demonstrating workflow orchestration for order processing and bulk product imports.

## Tech Stack

- **Framework**: NestJS 11
- **Language**: TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **Message Queue**: Redis (Synkro event transport)
- **Workflow Engine**: Synkro (event orchestration)
- **API Docs**: Swagger / OpenAPI
- **Package Manager**: pnpm

## Features

- Order processing with payment and shipment workflows
- Automatic rollback on payment failure (stock restoration)
- CSV bulk product import with batch processing
- Real-time workflow visualization via Synkro Dashboard
- Swagger API documentation

## Workflows

### Order Processing

```
Create Order → Reduce Stock → Create Payment → Process Payment
                                                  ├─ Success → Start Shipping → Complete Shipping
                                                  └─ Failure → Restore Stock (rollback)
```

Payment processing has a simulated 20% failure rate to demonstrate rollback handling.

### Product Import

```
Upload CSV → Save File → Parse & Insert (batches of 500) → Complete Import → Notify User
```

## API Endpoints

| Method | Path               | Description                  |
| ------ | ------------------ | ---------------------------- |
| GET    | `/products`        | List all products            |
| GET    | `/orders`          | List all orders              |
| GET    | `/orders/:id`      | Get order by ID              |
| POST   | `/orders`          | Create order                 |
| GET    | `/payments`        | List all payments            |
| GET    | `/payments/:id`    | Get payment by ID            |
| GET    | `/shipments`       | List all shipments           |
| GET    | `/shipments/:id`   | Get shipment by ID           |
| GET    | `/imports`         | List all imports             |
| GET    | `/imports/:id`     | Get import by ID             |
| POST   | `/imports/upload`  | Upload CSV for product import|
| GET    | `/api`             | Swagger UI                   |
| GET    | `/synkro`          | Synkro Dashboard             |

## Database Schema

- **products** — id, name, price, stock, timestamps
- **orders** — id, productId, quantity, totalPrice, status (pending/processing/completed/failed), timestamps
- **payments** — id, orderId, amount, status (pending/processing/completed/failed), timestamps
- **shipments** — id, orderId, status (pending/in_transit/delivered/failed), timestamps
- **productImports** — id, fileName, filePath, status, totalRecords, processedRecords, errorMessage, timestamps

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL
- Redis
- pnpm

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mydb
REDIS_URL=redis://localhost:6379
```

### Setup

```bash
# Install dependencies
pnpm install

# Run database migrations
pnpm run db:migrate

# Seed the database with sample products
pnpm run db:seed

# Start in development mode
pnpm run start:dev
```

The API will be available at `http://localhost:8080`. Visit `/api` for Swagger docs and `/synkro` for the workflow dashboard.

## Scripts

| Script            | Description                     |
| ----------------- | ------------------------------- |
| `start:dev`       | Start with hot-reload           |
| `start:prod`      | Start in production mode        |
| `build`           | Compile TypeScript              |
| `db:generate`     | Generate Drizzle migration files|
| `db:migrate`      | Run database migrations         |
| `db:seed`         | Seed database with sample data  |
| `test`            | Run unit tests                  |
| `test:e2e`        | Run end-to-end tests            |
| `test:cov`        | Run tests with coverage         |
| `lint`            | Lint and fix code               |
| `format`          | Format code with Prettier       |

## Project Structure

```
src/
├── database/           # Drizzle schema, migrations, seed
├── modules/
│   ├── order/          # Order CRUD + workflow trigger
│   ├── product/        # Product CRUD + stock management
│   ├── payment/        # Payment processing + event handlers
│   ├── shipment/       # Shipment tracking + event handlers
│   ├── import/         # CSV upload + batch import handlers
│   ├── notification/   # Import completion notifications
│   └── workflow/       # Synkro workflow definitions & enums
├── app.module.ts       # Root module with Synkro config
└── main.ts             # Bootstrap (Swagger + Synkro dashboard)
```

## License

[MIT](LICENSE)
