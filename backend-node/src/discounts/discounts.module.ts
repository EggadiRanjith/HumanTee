import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discount } from '../entities/discount.entity';
import { DiscountTargetGroup } from '../entities/discount-target-group.entity';
import { DiscountUsage } from '../entities/discount-usage.entity';
import { OrderDiscount } from '../entities/order-discount.entity';
import { Order } from '../orders/entities/order.entity';
import { DiscountsService } from './discounts.service';
import { DiscountsController } from './discounts.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Discount,
            DiscountTargetGroup,
            DiscountUsage,
            OrderDiscount,
            Order
        ]),
    ],
    providers: [DiscountsService],
    controllers: [DiscountsController],
    exports: [DiscountsService],
})
export class DiscountsModule { }
