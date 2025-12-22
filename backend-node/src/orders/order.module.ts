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

import { DiscountsModule } from '../discounts/discounts.module';

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
        ]),
    ],
    controllers: [OrderController, AdminOrdersController],
    providers: [OrderService],
    exports: [OrderService],
})
export class OrderModule { }
