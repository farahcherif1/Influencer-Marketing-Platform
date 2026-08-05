import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { seedData } from './seeder/seed-data';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  process.env.TZ = 'UTC';
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: process.env.VITE_APP_BASE_URL,
    credentials: true,
  });

  app.use(cookieParser());

  const dataSource = app.get(DataSource);
  await seedData(dataSource);

  await app.listen(port);
  console.log(`Application is listening on http://localhost:${port}`);

  process.on('unhandledRejection', (reason, promise) => {
    Logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });
}
bootstrap();
