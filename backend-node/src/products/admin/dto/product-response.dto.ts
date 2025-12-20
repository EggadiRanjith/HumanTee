export class ProductResponseDto {
    id: string;
    name: string;
    slug: string;
    description: string;
    productType: string;
    category: string;

    // Pricing
    basePrice: number;
    compareAtPrice?: number;
    costPerItem?: number;
    currency: string;
    taxable: boolean;

    // Inventory
    inventoryMode: string;
    trackInventory: boolean;
    stock: number;
    sku?: string;
    continueSellingWhenOutOfStock: boolean;
    lowStockThreshold?: number;

    // Organization
    status: string;
    isFeatured: boolean;

    // Relations
    images: ProductImageResponseDto[];
    variants: VariantResponseDto[];
    collections: CollectionResponseDto[];

    // Metadata
    version: number;
    createdAt: Date;
    updatedAt: Date;
}

export class ProductImageResponseDto {
    id: string;
    url: string;
    altText?: string;
    status: string;
    isPrimary: boolean;
    displayOrder: number;
    uploadedAt: Date;
}

export class VariantResponseDto {
    id: string;
    size: string;
    color: string;
    colorHex: string;
    sku: string;
    skuLocked: boolean;
    stock: number;
    priceOverride?: number;
    weight?: number;
    isActive: boolean;
}

export class CollectionResponseDto {
    id: string;
    name: string;
    slug: string;
    position: number;
}
