import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DelhiveryService } from './delhivery.service';
import { Shipment } from '../entities/shipment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Shipment])],
    providers: [DelhiveryService],
    exports: [DelhiveryService],
})
export class DelhiveryModule { }
