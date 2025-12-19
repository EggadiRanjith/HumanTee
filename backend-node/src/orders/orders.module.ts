import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { AdminOrdersController } from './admin-orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Payment } from '../payments/entities/payment.entity';
import { AuthUser } from '../entities/auth-user.entity';
import { RazorpayService } from '../payments/razorpay.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, OrderItem, Payment, AuthUser]),
        NotificationsModule,
    ],
    controllers: [OrdersController, AdminOrdersController],
    providers: [OrdersService, RazorpayService],
    exports: [OrdersService],
})
export class OrdersModule { }
