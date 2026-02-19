import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RazorpayWebhookController } from './razorpay-webhook.controller';
import { DelhiveryWebhookController } from './delhivery-webhook.controller';
import { OrderModule } from '../orders/order.module';
import { PaymentsModule } from '../payments/payments.module';
import { DelhiveryModule } from '../delhivery/delhivery.module';
import { Shipment } from '../entities/shipment.entity';
import { Order } from '../entities/order.entity';

@Module({
    imports: [
        OrderModule,
        PaymentsModule,
        DelhiveryModule,
        TypeOrmModule.forFeature([Shipment, Order]),
    ],
    controllers: [RazorpayWebhookController, DelhiveryWebhookController],
})
export class WebhooksModule { }
