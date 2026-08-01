import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());
  app.setGlobalPrefix('v1');
  app.enableCors();
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 FoodOS API successfully started on http://localhost:${port}`);
}
bootstrap();
