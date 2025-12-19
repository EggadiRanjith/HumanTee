import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart, CartItem, ProductVariant } from '../entities';

@Module({
    imports: [TypeOrmModule.forFeature([Cart, CartItem, ProductVariant])],
    controllers: [CartController],
    providers: [CartService],
    exports: [CartService],
})
export class CartModule { }
