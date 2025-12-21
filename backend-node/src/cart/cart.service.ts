import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart, CartItem, ProductVariant, Product } from '../entities';
import { CartStatus } from '../entities/cart.entity';
import { ProductStatus } from '../products/enums/product-status.enum';
import { MergeCartDto } from './dto/merge-cart.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
        @InjectRepository(CartItem)
        private cartItemRepository: Repository<CartItem>,
        @InjectRepository(ProductVariant)
        private variantRepo: Repository<ProductVariant>,
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
            });
            await this.cartRepository.save(cart);
        }

        return cart;
    }

    /**
     * Get active cart with items
     */
    async getActiveCart(userId: string): Promise<Cart> {
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
    }

    /**
     * Merge guest cart into user's backend cart (Phase 5: Re-validate everything)
     */
    async mergeGuestCart(
        userId: string,
        mergeCartDto: MergeCartDto
    ): Promise<{ cart: Cart; droppedItems: any[] }> {
        const cart = await this.getOrCreateActiveCart(userId);
        const droppedItems: Array<{ variantId: string; reason: string }> = [];

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

                // 1. Fetch variant with product (CORRECTED: fetch once)
                const variant = await this.variantRepo.findOne({
                    where: { id: guestItem.variantId },
                    relations: ['product'],
                });

                // 2. Validate variant exists and is active
                if (!variant || !variant.is_active) {
                    droppedItems.push({
                        variantId: guestItem.variantId,
                        reason: 'Variant no longer available',
                    });
                    continue;
                }

                // 3. Validate product is ACTIVE
                if (variant.product.status !== ProductStatus.ACTIVE) {
                    droppedItems.push({
                        variantId: guestItem.variantId,
                        reason: 'Product no longer available',
                    });
                    continue;
                }

                // 4. Find existing item
                const existingItem = cart.items.find(
                    (item) => item.variant_id === guestItem.variantId
                );

                // 5. Validate stock (CORRECTED: pass variant object)
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

                // 6. Merge or create
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

        return {
            cart: await this.getActiveCart(userId),
            droppedItems,
        };
    }

    /**
     * Add item to cart (Phase 5: Variant-based with stock validation)
     */
    async addItem(userId: string, dto: AddToCartDto): Promise<Cart> {
        // 1. Fetch variant with product relation (CORRECTED: fetch once)
        const variant = await this.variantRepo.findOne({
            where: { id: dto.variantId },
            relations: ['product'],
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
                product_image: null, // Until images supported
            });

            await this.cartItemRepository.save(newItem);
        }

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
