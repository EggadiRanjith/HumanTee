import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Index,
} from 'typeorm';
import { AuthUser } from './auth-user.entity';

@Entity('shipping_addresses')
@Index('idx_shipping_user_id', ['userId'])
@Index('idx_shipping_postal_code', ['postalCode'])
@Index('unique_default_address_per_user', ['userId'], {
    unique: true,
    where: 'is_default = true AND deleted_at IS NULL',
})
export class ShippingAddress {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @ManyToOne(() => AuthUser, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: AuthUser;

    // Contact Information
    @Column({ name: 'full_name', type: 'varchar', length: 255 })
    fullName: string;

    @Column({ type: 'varchar', length: 20 })
    phone: string;

    @Column({ type: 'varchar', length: 255 })
    email: string;

    // Address Details
    @Column({ name: 'house_number', type: 'varchar', length: 100 })
    houseNumber: string;

    @Column({ type: 'varchar', length: 500 })
    address: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    landmark: string;

    @Column({ type: 'varchar', length: 100 })
    city: string;

    @Column({ type: 'varchar', length: 100 })
    state: string;

    @Column({ name: 'postal_code', type: 'varchar', length: 20 })
    postalCode: string;

    @Column({ type: 'varchar', length: 100, default: 'India' })
    country: string;

    // Metadata
    @Column({ name: 'address_type', type: 'varchar', length: 20, default: 'home' })
    addressType: string; // 'home' | 'work' | 'other'

    @Column({ name: 'is_default', type: 'boolean', default: false })
    isDefault: boolean;

    // Lifecycle
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt: Date;
}
