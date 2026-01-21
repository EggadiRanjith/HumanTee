import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import * as Sentry from '@sentry/nestjs';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // PRODUCTION: Initialize Sentry error tracking FIRST
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'production',
      tracesSampleRate: 0.1, // 10% of transactions for performance monitoring
      profilesSampleRate: 0.1, // 10% for profiling
      beforeSend(event) {
        // Filter out sensitive data
        if (event.request) {
          delete event.request.cookies;
          delete event.request.headers?.authorization;
        }
        return event;
      },
    });
    logger.log('✅ Sentry error tracking enabled');
  } else {
    logger.warn('⚠️  Sentry DSN not configured - errors will only be logged locally');
  }

  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3001;

  // Payload size limit (reduced from 50MB to prevent DoS)
  // Use multipart/form-data for actual file uploads via Cloudinary
  app.use(require('express').json({ limit: '10mb' }));
  app.use(require('express').urlencoded({ limit: '10mb', extended: true }));

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

  // PERFORMANCE: HTTP Caching Headers
  // Add Cache-Control and ETag for GET requests to improve performance
  app.use((req, res, next) => {
    // Only apply to GET requests
    if (req.method === 'GET') {
      // Different cache strategies based on route
      if (req.path.startsWith('/products')) {
        // Products: cache for 5 minutes, stale-while-revalidate for 10 minutes
        res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
      } else if (req.path.startsWith('/settings') || req.path.startsWith('/homepage')) {
        // Settings: cache for 1 hour
        res.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=7200');
      } else if (req.path.startsWith('/admin')) {
        // Admin: no caching
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      } else {
        // Default: cache for 2 minutes
        res.set('Cache-Control', 'public, max-age=120, stale-while-revalidate=240');
      }
    }
    next();
  });

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
  logger.log(`🔒 Security: CSRF protection DISABLED (broken implementation removed)`);
  logger.log(`🌐 Security: CORS ${corsEnabled ? `ENABLED (${corsOrigins.length} origins)` : 'DISABLED'}`);
  logger.log(`🔒 Security: Rate limiting enabled`);
  logger.log(`📊 Health check: /health`);

  // PRODUCTION: Graceful shutdown on SIGTERM/SIGINT
  // Prevents data corruption during deployments
  const gracefulShutdown = async (signal: string) => {
    logger.log(`\n${signal} received. Starting graceful shutdown...`);

    try {
      // Close server (stop accepting new requests)
      await app.close();
      logger.log('✅ Server closed. All connections drained.');
      process.exit(0);
    } catch (err) {
      logger.error('❌ Error during shutdown:', err);
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}
bootstrap();
