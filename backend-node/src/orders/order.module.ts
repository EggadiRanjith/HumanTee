import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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

@Module({
    imports: [
        DiscountsModule,
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
