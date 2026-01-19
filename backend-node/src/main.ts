import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3001;

  // Increase payload size limit for image uploads (base64)
  app.use(require('express').json({ limit: '50mb' }));
  app.use(require('express').urlencoded({ limit: '50mb', extended: true }));

  // PERFORMANCE: Enable gzip/brotli compression for API responses
  // Reduces response sizes by 60-70% (JSON compression)
  app.use(compression({
    level: 6, // Balanced compression (1-9, higher = more compression but slower)
    threshold: 1024, // Only compress responses > 1KB
    filter: (req, res) => {
      // Don't compress if explicitly disabled
      if (req.headers['x-no-compression']) {
        return false;
      }
      // Use compression.filter for default filtering
      return compression.filter(req, res);
    },
  }));

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
    // Read CSRF setting from environment
    const csrfEnabled = process.env.CSRF_ENABLED === 'true';

    if (!csrfEnabled) {
      return next();
    }

    // CSRF protection for state-changing operations
    const csrfProtectedPaths = [
      '/auth/refresh',
      '/cart',
      '/orders',
      '/shipping',
      '/payments',
    ];

    if (csrfProtectedPaths.some(path => req.path.includes(path)) &&
      ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      const csrfToken = req.headers['x-csrf-token'];
      const cookieToken = req.cookies['csrf-token'];

      if (!csrfToken || csrfToken !== cookieToken) {
        return res.status(403).json({ message: 'Invalid CSRF token' });
      }
    }
    next();
  });

  // SECURITY: Helmet - Battle-tested security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'", // Required for Razorpay
          "https://checkout.razorpay.com",
          "https://vercel.live"
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'", // Required for inline styles
          "https://fonts.googleapis.com"
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com"
        ],
        imgSrc: [
          "'self'",
          "data:",
          "https://res.cloudinary.com",
          "https://lh3.googleusercontent.com"
        ],
        connectSrc: [
          "'self'",
          "https://humantee.onrender.com",
          "https://*.vercel.app",
          "https://*.google.com",
          "https://api.razorpay.com"
        ],
        frameSrc: [
          "https://api.razorpay.com",
          "https://checkout.razorpay.com",
          "https://vercel.live"
        ],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    frameguard: {
      action: 'deny',
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin',
    },
  }));

  // CORS configuration from environment
  const corsEnabled = process.env.CORS_ENABLED === 'true';
  const corsOrigins = process.env.CORS_ORIGINS?.split(',').map(o => o.trim()) || [];
  const corsCredentials = process.env.CORS_CREDENTIALS === 'true';

  if (corsEnabled) {
    app.enableCors({
      origin: corsOrigins.length > 0 ? corsOrigins : true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-TOKEN'],
      credentials: corsCredentials,
    });
    logger.log(`🌐 CORS: Enabled for origins: ${corsOrigins.join(', ')}`);
  } else {
    logger.warn('⚠️  CORS: DISABLED');
  }

  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Server is running on: http://localhost:${port}`);
  logger.log(`✅ Database connected successfully`);

  // Read CSRF setting for logging
  const csrfEnabled = process.env.CSRF_ENABLED === 'true';
  logger.log(`🔒 Security: CSRF protection ${csrfEnabled ? 'ENABLED' : 'DISABLED'}`);
  logger.log(`🌐 Security: CORS ${corsEnabled ? `ENABLED (${corsOrigins.length} origins)` : 'DISABLED'}`);
  logger.log(`🔒 Security: Rate limiting enabled`);
  logger.log(`📊 Health check: /health`);
}
bootstrap();
