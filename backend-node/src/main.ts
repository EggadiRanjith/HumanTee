import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3001;

  // Increase payload size limit for image uploads (base64)
  app.use(require('express').json({ limit: '50mb' }));
  app.use(require('express').urlencoded({ limit: '50mb', extended: true }));

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
      'http://localhost:3000',  // Customer app (laptop)
      'http://localhost:3002',  // Admin app
      'http://10.113.119.158:3000',  // Customer app (phone/network)
      process.env.FRONTEND_URL, // Production customer
      process.env.ADMIN_URL,    // Production admin
    ].filter(Boolean),
    credentials: true,
  });

  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Server is running on: http://localhost:${port}`);
  logger.log(`📱 Network access: http://10.113.119.158:${port}`);
  logger.log(`✅ Database connected successfully`);
}
bootstrap();
