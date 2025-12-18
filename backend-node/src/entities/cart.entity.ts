import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AuthUser } from './auth-user.entity';
import { CartItem } from './cart-item.entity';

export enum CartStatus {
    ACTIVE = 'ACTIVE',
    ORDERED = 'ORDERED',
}

@Entity('carts')
export class Cart {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    user_id: string;

    @Column({
        type: 'enum',
        enum: CartStatus,
        default: CartStatus.ACTIVE,
    })
    status: CartStatus;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relations
    @ManyToOne(() => AuthUser, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: AuthUser;

    @OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
    items: CartItem[];
}
