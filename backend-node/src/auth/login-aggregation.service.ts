import { Injectable } from '@nestjs/common';
import { CartService } from '../cart/cart.service';
import { ShippingService } from '../shipping/shipping.service';

export interface LoginPayload {
    version: number;
    accessToken: string;
    user: any;
    cart: {
        items: any[];
        itemCount: number;
    };
    addresses: any[];
    redirectUrl: string;
}

@Injectable()
export class LoginAggregationService {
    constructor(
        private readonly cartService: CartService,
        private readonly shippingService: ShippingService,
    ) { }

    /**
     * Phase 1.5: Build complete login payload with batched user data
     * Separates aggregation logic from auth controller
     */
    async buildLoginPayload(
        accessToken: string,
        user: any,
        redirectUrl: string,
    ): Promise<LoginPayload> {
        // Batch fetch user data (cart + addresses) in parallel
        const [cart, addresses] = await Promise.all([
            this.cartService.getActiveCart(user.id).catch((err) => {
                console.warn('[LOGIN_AGGREGATION] Cart fetch failed', {
                    userId: user.id,
                    error: err.message,
                });
                return { items: [] };
            }),
            this.shippingService.findAll(user.id).catch((err) => {
                console.warn('[LOGIN_AGGREGATION] Address fetch failed', {
                    userId: user.id,
                    error: err.message,
                });
                return [];
            }),
        ]);

        return {
            version: 1, // Response versioning for future compatibility
            accessToken,
            user,
            cart: {
                items: cart.items || [],
                itemCount: cart.items?.length || 0,
            },
            addresses: addresses || [],
            redirectUrl,
        };
    }
}
