import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ShippingModule } from './shipping/shipping.module';
import { ProtectedController } from './protected/protected.controller';
import { UploadModule } from './common/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,  // 60 seconds
      limit: 10,   // 10 requests per minute (default)
    }]),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'humantee',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // PHASE 1: Migrations only, no auto-sync
    }),
    AuthModule,
    CartModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
    NotificationsModule,
    ShippingModule,
    UploadModule,
  ],
  controllers: [AppController, ProtectedController],
  providers: [AppService],
})
export class AppModule { }
