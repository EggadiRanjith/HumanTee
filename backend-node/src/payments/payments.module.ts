import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookController } from './webhook.controller';
import { RazorpayService } from './razorpay.service';
import { Payment, Order } from '../entities';

@Module({
    imports: [TypeOrmModule.forFeature([Payment, Order])],
    controllers: [WebhookController],
    providers: [RazorpayService],
    exports: [RazorpayService],
})
export class PaymentsModule { }
