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

  // SECURITY: CSRF protection for cookie-based endpoints
  app.use((req: any, res: any, next: any) => {
    // Only apply CSRF to cookie-based auth endpoints
    const csrfProtectedPaths = ['/auth/refresh', '/auth/logout'];

    if (csrfProtectedPaths.some(path => req.path.includes(path))) {
      const csrfToken = req.headers['x-csrf-token'];
      const cookieToken = req.cookies['csrf-token'];

      if (!csrfToken || csrfToken !== cookieToken) {
        return res.status(403).json({ message: 'Invalid CSRF token' });
      }
    }
    next();
  });

  // SECURITY: Security headers
  app.use((req: any, res: any, next: any) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // CORS configuration
  app.enableCors({
    origin: [
      'http://localhost:3000',      // Customer store (local)
      'http://localhost:3002',      // Admin panel (local)
      'http://10.113.119.158:3000', // Customer store (network)
      'http://10.113.119.158:3002', // Admin panel (network)
      process.env.FRONTEND_URL,
      process.env.ADMIN_URL,
    ].filter(Boolean),
    credentials: true,
  });

  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Server is running on: http://localhost:${port}`);
  logger.log(`📱 Network access: http://10.113.119.158:${port}`);
  logger.log(`✅ Database connected successfully`);
  logger.log(`🔒 Security: CSRF protection enabled`);
  logger.log(`🔒 Security: Rate limiting enabled`);
}
bootstrap();
