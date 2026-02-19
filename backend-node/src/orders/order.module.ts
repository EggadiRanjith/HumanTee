import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { AdminOrdersController } from './admin-orders.controller';
import {
    Order,
    OrderItem,
    OrderAddress,
    Payment,
    Shipment,
    OrderStatusHistory,
} from '../entities';
import { Product } from '../products/entities/product.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { DiscountsModule } from '../discounts/discounts.module';
import { RazorpayService } from '../payments/razorpay.service';
import { AuthModule } from '../auth/auth.module';
import { RedisModule } from '../redis/redis.module';
import { EmailModule } from '../email/email.module';
import { SettingsModule } from '../settings/settings.module';
import { DelhiveryModule } from '../delhivery/delhivery.module';


@Module({
    imports: [
        DiscountsModule,
        AuthModule,
        RedisModule,
        EmailModule,
        SettingsModule,
        DelhiveryModule,
        PassportModule,

        JwtModule.register({
            secret: process.env.JWT_SECRET || 'your-secret-key',
            signOptions: { expiresIn: '15m' },
        }),
        TypeOrmModule.forFeature([
            Order,
            OrderItem,
            OrderAddress,
            Payment,
            Shipment,
            OrderStatusHistory,
            Product,
            ProductVariant,
        ]),
    ],
    controllers: [OrderController, AdminOrdersController],
    providers: [OrderService, RazorpayService],
    exports: [OrderService],
})
export class OrderModule { }
