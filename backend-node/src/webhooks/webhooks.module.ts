import { Module } from '@nestjs/common';
import { RazorpayWebhookController } from './razorpay-webhook.controller';
import { OrderModule } from '../orders/order.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
    imports: [OrderModule, PaymentsModule],
    controllers: [RazorpayWebhookController],
})
export class WebhooksModule { }
