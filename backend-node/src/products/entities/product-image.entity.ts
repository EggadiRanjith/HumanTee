import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { Product } from './product.entity';

/**
 * ProductImage Entity (PRODUCTION-GRADE)
 * Manages product images with TEMP/ACTIVE lifecycle
 */
@Entity('product_images')
@Index('idx_product_images_active', ['product_id', 'status', 'is_primary', 'display_order'])
export class ProductImage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    @Index('IDX_PRODUCT_IMAGES_PRODUCT_ID')
    product_id: string;

    @Column({ type: 'text' }) // Changed from varchar(500) to support base64 images
    url: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    alt_text: string;

    @Column({
        type: 'enum',
        enum: ['TEMP', 'ACTIVE'],
        default: 'TEMP',
    })
    status: string;

    @Column({ type: 'boolean', default: false })
    is_primary: boolean;

    @Column({ type: 'int', default: 0 })
    display_order: number;

    @Column({ type: 'timestamp', nullable: true })
    expires_at: Date;

    @CreateDateColumn()
    uploaded_at: Date;

    @ManyToOne(() => Product, (product) => product.images, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'product_id' })
    product: Product;
}
