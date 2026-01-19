import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Cart, CartItem, ProductVariant, Product } from '../entities';
import { CartStatus } from '../entities/cart.entity';
import { ProductStatus } from '../products/enums/product-status.enum';
import { MergeCartDto } from './dto/merge-cart.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CacheService } from '../redis/cache.service';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
        @InjectRepository(CartItem)
        private cartItemRepository: Repository<CartItem>,
        @InjectRepository(ProductVariant)
        private variantRepo: Repository<ProductVariant>,
        private readonly cacheService: CacheService,
    ) { }

    /**
     * Stock validation helper (CORRECTED: Pure function, no I/O)
     * Phase 5: Validate stock availability
     */
    private assertStockAvailable(
        variant: ProductVariant,
        requestedQty: number,
        existingQty: number = 0
    ): void {
        const totalQty = existingQty + requestedQty;

        if (totalQty > variant.stock_quantity) {
            throw new BadRequestException(
                `Insufficient stock. Available: ${variant.stock_quantity}, Requested: ${totalQty}`
            );
        }
    }

    /**
     * Get or create active cart for user
     */
    async getOrCreateActiveCart(userId: string): Promise<Cart> {
        let cart = await this.cartRepository.findOne({
            where: { user_id: userId, status: CartStatus.ACTIVE },
            relations: ['items'],
        });

        if (!cart) {
            cart = this.cartRepository.create({
                user_id: userId,
                status: CartStatus.ACTIVE,
                items: [], // ✅ Initialize items array
            });
            await this.cartRepository.save(cart);
        }

        return cart;
    }

    /**
     * Get active cart with items and Redis caching
     * Cache: 1 hour (invalidated on cart updates)
     */
    async getActiveCart(userId: string): Promise<Cart> {
        return this.cacheService.remember(
            `cart:${userId}`,
            async () => {
                const cart = await this.cartRepository.findOne({
                    where: { user_id: userId, status: CartStatus.ACTIVE },
                    relations: ['items'],
                });

                if (!cart) {
                    // Return empty cart structure
                    return this.cartRepository.create({
                        user_id: userId,
                        status: CartStatus.ACTIVE,
                        items: [],
                    });
                }

                return cart;
            },
            { ttl: 1800 } // 30 min - invalidated on cart updates
        );
    }

    /**
     * Merge guest cart into user's backend cart (Phase 5: Re-validate everything)
     * OPTIMIZED: Batch variant lookups to reduce queries from 7→2
     */
    async mergeGuestCart(
        userId: string,
        mergeCartDto: MergeCartDto
    ): Promise<{ cart: Cart; droppedItems: any[] }> {
        const cart = await this.getOrCreateActiveCart(userId);
        const droppedItems: Array<{ variantId: string; reason: string }> = [];

        // OPTIMIZATION: Batch fetch all variants in single query
        const variantIds = mergeCartDto.items
            .map(item => item.variantId)
            .filter(Boolean);

        if (variantIds.length === 0) {
            return { cart: await this.getActiveCart(userId), droppedItems };
        }

        const variants = await this.variantRepo.find({
            where: { id: In(variantIds) },
            relations: ['product'],
        });

        // Create variant lookup map
        const variantMap = new Map(variants.map(v => [v.id, v]));

        for (const guestItem of mergeCartDto.items) {
            try {
                // Skip items without variantId
                if (!guestItem.variantId) {
                    droppedItems.push({
                        variantId: 'unknown',
                        reason: 'Missing variant ID',
                    });
                    continue;
                }

                // Fetch variant from map (no DB query)
                const variant = variantMap.get(guestItem.variantId);

                // Validate variant exists and is active
                if (!variant || !variant.is_active) {
                    droppedItems.push({
                        variantId: guestItem.variantId,
                        reason: 'Variant no longer available',
                    });
                    continue;
                }

                // Validate product is ACTIVE
                if (variant.product.status !== ProductStatus.ACTIVE) {
                    droppedItems.push({
                        variantId: guestItem.variantId,
                        reason: 'Product no longer available',
                    });
                    continue;
                }

                // Find existing item
                const existingItem = cart.items.find(
                    (item) => item.variant_id === guestItem.variantId
                );

                // Validate stock
                try {
                    this.assertStockAvailable(
                        variant,
                        guestItem.quantity,
                        existingItem?.quantity || 0
                    );
                } catch (error) {
                    droppedItems.push({
                        variantId: guestItem.variantId,
                        reason: error.message,
                    });
                    continue;
                }

                // Merge or create
                if (existingItem) {
                    existingItem.quantity += guestItem.quantity;
                    await this.cartItemRepository.save(existingItem);
                } else {
                    // Create with fresh snapshots
                    const newItem = this.cartItemRepository.create({
                        cart_id: cart.id,
                        product_id: variant.product.id,
                        variant_id: variant.id,
                        quantity: guestItem.quantity,
                        price_snapshot: variant.price,
                        currency: 'INR',
                        product_title: variant.product.name,
                        variant_label: variant.size,
                        product_image: null,
                    });
                    await this.cartItemRepository.save(newItem);
                }
            } catch (error) {
                droppedItems.push({
                    variantId: guestItem.variantId || 'unknown',
                    reason: error.message,
                });
            }
        }

        // Invalidate cache after merge
        await this.cacheService.forget(`cart:${userId}`);

        return {
            cart: await this.getActiveCart(userId),
            droppedItems,
        };
    }

    /**
     * Add item to cart (Phase 5: Variant-based with stock validation)
     */
    async addItem(userId: string, dto: AddToCartDto): Promise<Cart> {
        // 1. Fetch variant with product and images relations
        const variant = await this.variantRepo.findOne({
            where: { id: dto.variantId },
            relations: ['product', 'product.images'],
        });

        // 2. Validate variant exists
        if (!variant) {
            throw new NotFoundException('Variant not found');
        }

        // 3. Validate variant is active
        if (!variant.is_active) {
            throw new BadRequestException('Variant is not available');
        }

        // 4. Validate product is ACTIVE
        if (variant.product.status !== ProductStatus.ACTIVE) {
            throw new BadRequestException('Product is not available');
        }

        // 5. Get or create cart
        const cart = await this.getOrCreateActiveCart(userId);

        // 6. Check if item exists
        const existingItem = cart.items.find(
            (item) => item.variant_id === dto.variantId
        );

        if (existingItem) {
            // 7a. Validate stock for increment (CORRECTED: pass variant object)
            this.assertStockAvailable(variant, dto.quantity, existingItem.quantity);

            // 7b. Increment quantity
            existingItem.quantity += dto.quantity;
            await this.cartItemRepository.save(existingItem);
        } else {
            // 8a. Validate stock for new item (CORRECTED: pass variant object)
            this.assertStockAvailable(variant, dto.quantity, 0);

            // Get primary product image
            const primaryImage = variant.product.images?.find(img => img.is_primary && img.status === 'ACTIVE');
            const imageUrl = primaryImage?.url || null;

            // 8b. Create item with snapshots
            const newItem = this.cartItemRepository.create({
                cart_id: cart.id,
                product_id: variant.product.id,
                variant_id: variant.id,
                quantity: dto.quantity,

                // Snapshots (backend-controlled)
                price_snapshot: variant.price,
                currency: 'INR', // TEMP: Phase 6 will add to variant model
                product_title: variant.product.name,
                variant_label: variant.size,
                product_image: imageUrl, // ✅ Include primary product image
            });

            await this.cartItemRepository.save(newItem);
        }

        // Invalidate cache after adding item
        await this.cacheService.forget(`cart:${userId}`);

        return this.getActiveCart(userId);
    }

    /**
     * Update item quantity (Phase 5: Stock validation, reject quantity < 1)
     */
    async updateItemQuantity(
        userId: string,
        itemId: string,
        dto: UpdateCartItemDto
    ): Promise<Cart> {
        // 1. Fetch item with variant relation (CORRECTED: fetch once)
        const item = await this.cartItemRepository.findOne({
            where: { id: itemId },
            relations: ['cart', 'variant'],
        });

        // 2. Validate ownership
        if (!item || item.cart.user_id !== userId) {
            throw new NotFoundException('Cart item not found');
        }

        // 3. CORRECTED: Reject quantity < 1 (no silent deletion)
        if (dto.quantity < 1) {
            throw new BadRequestException(
                'Quantity must be at least 1. Use DELETE endpoint to remove item.'
            );
        }

        // 4. Validate variant still exists
        if (!item.variant) {
            throw new BadRequestException(
                'Variant no longer available. Please remove this item.'
            );
        }

        // 5. Validate stock (CORRECTED: pass variant object)
        this.assertStockAvailable(item.variant, dto.quantity, 0);

        // 6. Update quantity
        item.quantity = dto.quantity;
        await this.cartItemRepository.save(item);

        // Invalidate cache after update
        await this.cacheService.forget(`cart:${userId}`);

        return this.getActiveCart(userId);
    }

    /**
     * Remove item from cart
     */
    async removeItem(userId: string, itemId: string): Promise<Cart> {
        const item = await this.cartItemRepository.findOne({
            where: { id: itemId },
            relations: ['cart'],
        });

        if (!item || item.cart.user_id !== userId) {
            throw new NotFoundException('Cart item not found');
        }

        await this.cartItemRepository.remove(item);

        // Invalidate cache after removing item
        await this.cacheService.forget(`cart:${userId}`);

        return this.getActiveCart(userId);
    }

    /**
     * Clear cart (remove all items)
     */
    async clearCart(userId: string): Promise<Cart> {
        const cart = await this.getActiveCart(userId);

        if (cart.id) {
            await this.cartItemRepository.delete({ cart_id: cart.id });
        }

        // Invalidate cache after clearing
        await this.cacheService.forget(`cart:${userId}`);

        return this.getActiveCart(userId);
    }

    /**
     * Mark cart as ordered (called after successful order creation)
     */
    async markCartAsOrdered(userId: string): Promise<void> {
        const cart = await this.cartRepository.findOne({
            where: { user_id: userId, status: CartStatus.ACTIVE },
        });

        if (cart) {
            cart.status = CartStatus.ORDERED;
            await this.cartRepository.save(cart);
        }
    }
}
