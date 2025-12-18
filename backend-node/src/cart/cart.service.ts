import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart, CartItem } from '../entities';
import { CartStatus } from '../entities/cart.entity';
import { MergeCartDto } from './dto/merge-cart.dto';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
        @InjectRepository(CartItem)
        private cartItemRepository: Repository<CartItem>,
    ) { }

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
     * Merge guest cart into user's backend cart (IDEMPOTENT)
     * Called after login
     */
    async mergeGuestCart(userId: string, mergeCartDto: MergeCartDto): Promise<Cart> {
        const cart = await this.getOrCreateActiveCart(userId);

        // Process each item from guest cart
        for (const guestItem of mergeCartDto.items) {
            // Find existing item in backend cart
            const existingItem = cart.items.find(
                (item) =>
                    item.product_id === guestItem.productId &&
                    item.variant_id === guestItem.variantId &&
                    item.size === guestItem.size,
            );

            if (existingItem) {
                // Merge quantities
                existingItem.quantity += guestItem.quantity;
                await this.cartItemRepository.save(existingItem);
            } else {
                // Add new item
                const newItem = this.cartItemRepository.create({
                    cart_id: cart.id,
                    product_id: guestItem.productId,
                    variant_id: guestItem.variantId,
                    quantity: guestItem.quantity,
                    price_snapshot: guestItem.price,
                    currency: guestItem.currency || 'USD',
                    product_title: guestItem.productTitle,
                    product_image: guestItem.productImage,
                    size: guestItem.size,
                });
                await this.cartItemRepository.save(newItem);
            }
        }

        // Reload cart with updated items
        return this.getActiveCart(userId);
    }

    /**
     * Add item to cart
     */
    async addItem(userId: string, itemDto: any): Promise<Cart> {
        const cart = await this.getOrCreateActiveCart(userId);

        // Check if item already exists
        const existingItem = cart.items.find(
            (item) =>
                item.product_id === itemDto.productId &&
                item.variant_id === itemDto.variantId &&
                item.size === itemDto.size,
        );

        if (existingItem) {
            existingItem.quantity += itemDto.quantity;
            await this.cartItemRepository.save(existingItem);
        } else {
            const newItem = this.cartItemRepository.create({
                cart_id: cart.id,
                product_id: itemDto.productId,
                variant_id: itemDto.variantId,
                quantity: itemDto.quantity,
                price_snapshot: itemDto.price,
                currency: itemDto.currency || 'USD',
                product_title: itemDto.productTitle,
                product_image: itemDto.productImage,
                size: itemDto.size,
            });
            await this.cartItemRepository.save(newItem);
        }

        return this.getActiveCart(userId);
    }

    /**
     * Update item quantity
     */
    async updateItemQuantity(userId: string, itemId: string, quantity: number): Promise<Cart> {
        const item = await this.cartItemRepository.findOne({
            where: { id: itemId },
            relations: ['cart'],
        });

        if (!item || item.cart.user_id !== userId) {
            throw new NotFoundException('Cart item not found');
        }

        if (quantity <= 0) {
            await this.cartItemRepository.remove(item);
        } else {
            item.quantity = quantity;
            await this.cartItemRepository.save(item);
        }

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
