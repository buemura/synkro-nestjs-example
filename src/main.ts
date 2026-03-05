import { NestFactory } from '@nestjs/core';
import { SynkroService } from '@synkro/nestjs';
import { createDashboardHandler } from '@synkro/ui';
import type { Request, Response } from 'express';

import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

function createSynkroDashboard(app: INestApplication): void {
  const synkroService = app.get(SynkroService);
  const expressApp = app
    .getHttpAdapter()
    .getInstance() as import('express').Application;

  let dashboardHandler: ReturnType<typeof createDashboardHandler> | null = null;

  expressApp.use('/synkro', (req: Request, res: Response) => {
    if (!dashboardHandler) {
      dashboardHandler = createDashboardHandler(synkroService.getInstance(), {
        basePath: '/synkro',
      });
    }
    dashboardHandler(req, res);
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setDescription('Event-driven ecommerce API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  createSynkroDashboard(app);
  await app.listen(process.env.PORT ?? 8080);
}
void bootstrap();
