import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingService } from './shipping.service';
import { ShippingController } from './shipping.controller';
import { ShippingAddress } from '../entities/shipping-address.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ShippingAddress])],
    controllers: [ShippingController],
    providers: [ShippingService],
    exports: [ShippingService],
})
export class ShippingModule { }
