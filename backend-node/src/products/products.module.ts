import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
