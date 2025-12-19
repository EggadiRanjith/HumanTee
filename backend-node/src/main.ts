import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3001;

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Cookie parser for refresh tokens
  app.use(cookieParser());

  // CORS configuration - Phase 8: Allow both customer and admin apps
  app.enableCors({
    origin: [
      'http://localhost:3000',  // Customer app
      'http://localhost:3002',  // Admin app
      process.env.FRONTEND_URL, // Production customer
      process.env.ADMIN_URL,    // Production admin
    ].filter(Boolean),
    credentials: true,
  });

  await app.listen(port);

  logger.log(`🚀 Server is running on: http://localhost:${port}`);
  logger.log(`✅ Database connected successfully`);
}
bootstrap();
