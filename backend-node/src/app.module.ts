import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { ProductsModule } from './products/products.module';
import { OrderModule as OrdersModule } from './orders/order.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ShippingModule } from './shipping/shipping.module';
import { ProtectedController } from './protected/protected.controller';
import { UploadModule } from './common/upload/upload.module';
import { TicketsModule } from './tickets/tickets.module';
import { DiscountsModule } from './discounts/discounts.module';
import { SettingsModule } from './settings/settings.module';
import { MaintenanceModule } from './settings/maintenance.module';
import { ObservabilityModule } from './common/observability.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ContactModule } from './contact/contact.module';
import { HealthModule } from './health/health.module';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { DatabaseQueryInterceptor } from './common/interceptors/database-query.interceptor';
// import { RedisModule } from './redis/redis.module'; // Disabled - Docker not running



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommonModule, // Global module for security services
    ThrottlerModule.forRoot([
      { name: 'default', ttl: 60000, limit: 100 }, // 100 req/min default
      { name: 'webhook', ttl: 60000, limit: 20 },   // 20 req/min for webhooks
      { name: 'order', ttl: 60000, limit: 5 },      // 5 req/min for orders
      { name: 'admin', ttl: 60000, limit: 30 },     // 30 req/min for admin
      { name: 'strict', ttl: 60000, limit: 10 },    // 10 req/min for strict endpoints
    ]),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get('DATABASE_URL');

        if (databaseUrl) {
          // Production: Use DATABASE_URL (Neon)
          return {
            type: 'postgres',
            url: databaseUrl,
            ssl: { rejectUnauthorized: false },
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: false, // Disabled - will use SQL script instead
            logging: false,
            extra: {
              max: 20,
              min: 5,
              idleTimeoutMillis: 30000,
              connectionTimeoutMillis: 2000,
            },
          };
        }

        // Development: Use individual variables
        return {
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: parseInt(configService.get('DB_PORT', '5432')),
          username: configService.get('DB_USERNAME', 'postgres'),
          password: configService.get('DB_PASSWORD', 'postgres'),
          database: configService.get('DB_DATABASE', 'humantee'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: false,
          logging: false,
          extra: {
            max: 20,
            min: 5,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
          },
        };
      },
    }),
    AuthModule,
    CartModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
    NotificationsModule,
    ShippingModule,
    UploadModule,
    TicketsModule,
    DiscountsModule,
    SettingsModule,
    MaintenanceModule,
    ObservabilityModule, // Health checks + Prometheus metrics
    AnalyticsModule, // Admin analytics
    ContactModule, // Public contact form
    HealthModule, // Health check endpoint
    // RedisModule, // Disabled - Docker not running
  ],
  controllers: [AppController, ProtectedController],
  providers: [
    AppService,
    DatabaseQueryInterceptor, // Track DB queries per request
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule { }
