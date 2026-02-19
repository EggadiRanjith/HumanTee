import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsController, AdminTicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { Ticket, TicketMessage, TicketStatusHistory } from '../entities';
import { Order } from '../entities/order.entity';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Ticket, TicketMessage, TicketStatusHistory, Order]),
        AuthModule,
        EmailModule,
    ],
    controllers: [TicketsController, AdminTicketsController],
    providers: [TicketsService],
    exports: [TicketsService],
})
export class TicketsModule { }
