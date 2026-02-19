import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartService } from '../cart/cart.service';
import { ShippingService } from '../shipping/shipping.service';
import { UserProfile } from '../entities/user-profile.entity';
import { AuthUser } from '../entities/auth-user.entity';

export interface LoginPayload {
    version: number;
    accessToken: string;
    user: any;
    profile: any;
    cart: {
        items: any[];
        itemCount: number;
    };
    addresses: any[];
    redirectUrl: string;
}

@Injectable()
export class LoginAggregationService {
    private readonly logger = new Logger(LoginAggregationService.name);

    constructor(
        private readonly cartService: CartService,
        private readonly shippingService: ShippingService,
        @InjectRepository(UserProfile)
        private readonly userProfileRepository: Repository<UserProfile>,
        @InjectRepository(AuthUser)
        private readonly authUserRepository: Repository<AuthUser>,
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
        // Batch fetch user data (cart + addresses + profile) in parallel
        const [cart, addresses, profile] = await Promise.all([
            this.cartService.getActiveCart(user.id).catch((err) => {
                return { items: [] };
            }),
            this.shippingService.findAll(user.id).catch((err) => {
                return [];
            }),
            this.fetchProfile(user.id).catch((err) => {
                return null;
            }),
        ]);

        return {
            version: 1, // Response versioning for future compatibility
            accessToken,
            user,
            profile,
            cart: {
                items: cart.items || [],
                itemCount: cart.items?.length || 0,
            },
            addresses: addresses || [],
            redirectUrl,
        };
    }

    private async fetchProfile(userId: string) {
        const user = await this.authUserRepository.findOne({
            where: { id: userId },
            relations: ['profile'],
        });

        if (!user) return null;

        return {
            id: user.id,
            email: user.email,
            role: user.role,
            profile: {
                fullName: user.profile?.full_name,
                phone: user.profile?.phone,
                avatarUrl: user.profile?.avatar_url,
            },
            profileComplete: !!(user.profile?.full_name && user.profile?.phone),
        };
    }
}
