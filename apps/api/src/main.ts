import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './shared/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.setGlobalPrefix('v1');
  app.enableCors();
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 FoodOS API successfully started on http://localhost:${port}`);
}
bootstrap();
