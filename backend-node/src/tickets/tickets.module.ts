import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsController, AdminTicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { Ticket, TicketMessage, TicketStatusHistory } from '../entities';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Ticket, TicketMessage, TicketStatusHistory]),
        AuthModule,
    ],
    controllers: [TicketsController, AdminTicketsController],
    providers: [TicketsService],
    exports: [TicketsService],
})
export class TicketsModule { }
