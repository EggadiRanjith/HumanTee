import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../products/entities/product.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';

@Entity('cart_items')
export class CartItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    cart_id: string;

    @Column({ type: 'uuid', nullable: true }) // Nullable for SET NULL
    product_id: string;

    @Column({ type: 'uuid', nullable: true }) // Nullable for SET NULL
    variant_id: string;

    @Column({ type: 'int' })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price_snapshot: number;

    @Column({ type: 'varchar', length: 3, default: 'INR' })
    currency: string;

    // Snapshot fields (authoritative for display)
    @Column({ type: 'text', nullable: true })
    product_title: string;

    @Column({ type: 'text', nullable: true })
    product_image: string | null;

    @Column({ type: 'text', nullable: true })
    variant_label: string; // e.g., "M / Black"

    @CreateDateColumn()
    created_at: Date;

    // Relations
    @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'cart_id' })
    cart: Cart;

    @ManyToOne(() => Product, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => ProductVariant, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'variant_id' })
    variant: ProductVariant;
}
