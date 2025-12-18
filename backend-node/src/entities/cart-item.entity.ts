import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cart } from './cart.entity';

@Entity('cart_items')
export class CartItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    cart_id: string;

    @Column({ type: 'varchar' })
    product_id: string;

    @Column({ type: 'varchar', nullable: true })
    variant_id: string;

    @Column({ type: 'int' })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price_snapshot: number;

    @Column({ type: 'varchar', length: 3, default: 'USD' })
    currency: string;

    @Column({ type: 'text', nullable: true })
    product_title: string;

    @Column({ type: 'text', nullable: true })
    product_image: string;

    @Column({ type: 'varchar', nullable: true })
    size: string;

    @CreateDateColumn()
    created_at: Date;

    // Relations
    @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'cart_id' })
    cart: Cart;
}
