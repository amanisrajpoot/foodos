let cachedServer: any;

export default async function handler(req: any, res: any) {
  try {
    if (!cachedServer) {
      // @ts-ignore
      const { NestFactory } = await import('@nestjs/core');
      // @ts-ignore
      const { AppModule } = await import('../src/app.module');
      // @ts-ignore
      const { ExpressAdapter } = await import('@nestjs/platform-express');
      // @ts-ignore
      const express = (await import('express')).default;
      const { PrismaExceptionFilter } = await import('../src/shared/filters/prisma-exception.filter');
      
      const server = express();
      const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
      app.useGlobalFilters(new PrismaExceptionFilter());
      app.setGlobalPrefix('v1');
      app.enableCors({ origin: '*', credentials: true });
      await app.init();
      cachedServer = server;
    }
    cachedServer(req, res);
  } catch (e: any) {
    res.status(500).json({
      error: 'Vercel Initialization Error',
      message: e.message,
      stack: e.stack,
    });
  }
}
