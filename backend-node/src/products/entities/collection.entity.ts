import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index,
} from 'typeorm';
import { ProductCollectionMap } from './product-collection-map.entity';

/**
 * Collection Entity (PRODUCTION-GRADE)
 * Manages product collections with scheduling support
 */
@Entity('collections')
@Index('idx_collections_active', ['is_active', 'scheduled_start', 'scheduled_end'])
export class Collection {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    @Index('IDX_COLLECTIONS_NAME')
    name: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    @Index('IDX_COLLECTIONS_SLUG')
    slug: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'timestamp', nullable: true })
    scheduled_start: Date;

    @Column({ type: 'timestamp', nullable: true })
    scheduled_end: Date;

    @Column({ type: 'int', default: 0 })
    display_order: number;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => ProductCollectionMap, (map) => map.collection)
    products: ProductCollectionMap[];
}
