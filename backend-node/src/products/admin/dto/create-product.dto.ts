import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsArray, IsEnum, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

// ============================================================================
// ENUMS
// ============================================================================

export enum ProductTypeEnum {
    TSHIRT = 't-shirt',
    HOODIE = 'hoodie',
    SWEATSHIRT = 'sweatshirt',
    ACCESSORIES = 'accessories',
}

export enum CategoryEnum {
    DROP1 = 'drop1',
    DROP2 = 'drop2',
    DROP3 = 'drop3',
}

export enum ProductStatusEnum {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    ARCHIVED = 'ARCHIVED',
}

export enum InventoryModeEnum {
    SINGLE = 'SINGLE',
    VARIANT = 'VARIANT',
}

// ============================================================================
// NESTED DTOs
// ============================================================================

export class CreateProductImageDto {
    @IsString()
    @IsNotEmpty()
    url: string;

    @IsString()
    @IsOptional()
    altText?: string;

    @IsBoolean()
    isPrimary: boolean;

    @IsNumber()
    @Min(0)
    order: number;
}

export class CreateVariantDto {
    @IsString()
    @IsNotEmpty()
    size: string;

    @IsString()
    @IsNotEmpty()
    sku: string;

    @IsNumber()
    @Min(0)
    stock: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    priceOverride?: number;


}

// ============================================================================
// MAIN CREATE DTO
// ============================================================================

export class CreateProductDto {
    // Basic Info
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsEnum(ProductTypeEnum)
    productType: ProductTypeEnum;

    @IsEnum(CategoryEnum)
    category: CategoryEnum;

    // Media
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProductImageDto)
    images: CreateProductImageDto[];

    // Pricing
    @IsNumber()
    @Min(0)
    price: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    compareAtPrice?: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    costPerItem?: number;

    @IsString()
    @IsOptional()
    currency?: string;

    @IsBoolean()
    @IsOptional()
    taxable?: boolean;

    // Variants
    @IsBoolean()
    hasVariants: boolean;

    @IsEnum(InventoryModeEnum)
    inventoryMode: InventoryModeEnum;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateVariantDto)
    @IsOptional()
    variants?: CreateVariantDto[];

    // Inventory (SINGLE mode only)
    @IsBoolean()
    trackInventory: boolean;

    @IsNumber()
    @IsOptional()
    @Min(0)
    stock?: number;

    @IsString()
    @IsOptional()
    sku?: string;

    @IsBoolean()
    @IsOptional()
    continueSellingWhenOutOfStock?: boolean;

    @IsNumber()
    @IsOptional()
    @Min(0)
    @Max(9999)
    lowStockThreshold?: number;

    // Organization
    @IsEnum(ProductStatusEnum)
    @IsOptional()
    status?: ProductStatusEnum;

    @IsBoolean()
    @IsOptional()
    isFeatured?: boolean;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    collections?: string[];
}

// ============================================================================
// UPDATE DTO
// ============================================================================

export class UpdateProductDto {
    // Basic Info
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(ProductTypeEnum)
    @IsOptional()
    productType?: ProductTypeEnum;

    @IsEnum(CategoryEnum)
    @IsOptional()
    category?: CategoryEnum;

    // Media
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProductImageDto)
    @IsOptional()
    images?: CreateProductImageDto[];

    // Pricing
    @IsNumber()
    @Min(0)
    @IsOptional()
    price?: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    compareAtPrice?: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    costPerItem?: number;

    @IsBoolean()
    @IsOptional()
    taxable?: boolean;

    // Variants
    @IsBoolean()
    @IsOptional()
    hasVariants?: boolean;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateVariantDto)
    @IsOptional()
    variants?: CreateVariantDto[];

    // Inventory
    @IsEnum(InventoryModeEnum)
    @IsOptional()
    inventoryMode?: InventoryModeEnum;

    @IsBoolean()
    @IsOptional()
    trackInventory?: boolean;

    @IsNumber()
    @Min(0)
    @IsOptional()
    stock?: number;

    @IsString()
    @IsOptional()
    sku?: string;

    @IsBoolean()
    @IsOptional()
    continueSellingWhenOutOfStock?: boolean;

    @IsNumber()
    @Min(0)
    @Max(9999)
    @IsOptional()
    lowStockThreshold?: number;

    // Organization
    @IsEnum(ProductStatusEnum)
    @IsOptional()
    status?: ProductStatusEnum;

    @IsBoolean()
    @IsOptional()
    isFeatured?: boolean;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    collections?: string[];
}
