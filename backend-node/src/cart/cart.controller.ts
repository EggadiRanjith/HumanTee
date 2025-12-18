import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CartService } from './cart.service';
import { MergeCartDto } from './dto/merge-cart.dto';
import { CartItemDto } from './dto/cart-item.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
    constructor(private readonly cartService: CartService) { }

    /**
     * GET /cart - Get active cart
     */
    @Get()
    async getCart(@Req() req: any) {
        const cart = await this.cartService.getActiveCart(req.user.userId);
        return {
            id: cart.id,
            items: cart.items?.map((item) => ({
                id: item.id,
                productId: item.product_id,
                variantId: item.variant_id,
                quantity: item.quantity,
                price: parseFloat(item.price_snapshot.toString()),
                currency: item.currency,
                productTitle: item.product_title,
                productImage: item.product_image,
                size: item.size,
            })) || [],
            totalItems: cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
            totalPrice: cart.items?.reduce((sum, item) => sum + parseFloat(item.price_snapshot.toString()) * item.quantity, 0) || 0,
        };
    }

    /**
     * POST /cart/merge - Merge guest cart (called after login)
     * IDEMPOTENT - safe to retry
     */
    @Post('merge')
    async mergeCart(@Req() req: any, @Body() mergeCartDto: MergeCartDto) {
        const cart = await this.cartService.mergeGuestCart(req.user.userId, mergeCartDto);
        return {
            message: 'Cart merged successfully',
            cart: {
                id: cart.id,
                items: cart.items?.map((item) => ({
                    id: item.id,
                    productId: item.product_id,
                    variantId: item.variant_id,
                    quantity: item.quantity,
                    price: parseFloat(item.price_snapshot.toString()),
                    currency: item.currency,
                    productTitle: item.product_title,
                    productImage: item.product_image,
                    size: item.size,
                })) || [],
            },
        };
    }

    /**
     * POST /cart/items - Add item to cart
     */
    @Post('items')
    async addItem(@Req() req: any, @Body() itemDto: CartItemDto) {
        const cart = await this.cartService.addItem(req.user.userId, itemDto);
        return this.getCart(req);
    }

    /**
     * PATCH /cart/items/:id - Update item quantity
     */
    @Patch('items/:id')
    async updateItem(@Req() req: any, @Param('id') itemId: string, @Body() body: { quantity: number }) {
        await this.cartService.updateItemQuantity(req.user.userId, itemId, body.quantity);
        return this.getCart(req);
    }

    /**
     * DELETE /cart/items/:id - Remove item
     */
    @Delete('items/:id')
    async removeItem(@Req() req: any, @Param('id') itemId: string) {
        await this.cartService.removeItem(req.user.userId, itemId);
        return this.getCart(req);
    }

    /**
     * DELETE /cart - Clear cart
     */
    @Delete()
    async clearCart(@Req() req: any) {
        await this.cartService.clearCart(req.user.userId);
        return { message: 'Cart cleared successfully' };
    }
}
