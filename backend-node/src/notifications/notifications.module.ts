import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from './email.service';
import { OrderNotification } from './entities/order-notification.entity';

@Module({
    imports: [TypeOrmModule.forFeature([OrderNotification])],
    providers: [EmailService],
    exports: [EmailService],
})
export class NotificationsModule { }
