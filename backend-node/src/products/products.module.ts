import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductImage } from './entities/product-image.entity';
import { Collection } from './entities/collection.entity';
import { ProductCollectionMap } from './entities/product-collection-map.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AdminProductsService } from './admin/admin-products.service';
import { AdminVariantsService } from './admin/admin-variants.service';
import { AdminProductsController } from './admin/admin-products.controller';
import { AdminVariantsController } from './admin/admin-variants.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Product,
            ProductVariant,
            ProductImage,
            Collection,
            ProductCollectionMap,
        ]),
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'your-secret-key',
            signOptions: { expiresIn: '15m' },
        }),
    ],
    controllers: [
        ProductsController,
        AdminProductsController,
        AdminVariantsController,
    ],
    providers: [
        ProductsService,
        AdminProductsService,
        AdminVariantsService,
    ],
    exports: [ProductsService, AdminProductsService, AdminVariantsService],
})
export class ProductsModule { }
