import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookController } from './webhook.controller';
import { RazorpayService } from './razorpay.service';
import { Payment } from './entities/payment.entity';
import { Order } from '../orders/entities/order.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Payment, Order])],
    controllers: [WebhookController],
    providers: [RazorpayService],
    exports: [RazorpayService],
})
export class PaymentsModule { }
