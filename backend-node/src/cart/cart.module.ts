import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart, CartItem, ProductVariant } from '../entities';
import { RedisModule } from '../redis/redis.module';
import { DiscountsModule } from '../discounts/discounts.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Cart, CartItem, ProductVariant]),
        RedisModule,
        forwardRef(() => DiscountsModule), // NEW: Enable discount suggestions in cart endpoint
    ],
    controllers: [CartController],
    providers: [CartService],
    exports: [CartService],
})
export class CartModule { }
