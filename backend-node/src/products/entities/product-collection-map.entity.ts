import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { Product } from './product.entity';
import { Collection } from './collection.entity';

/**
 * ProductCollectionMap Entity (PRODUCTION-GRADE)
 * Junction table for Product <-> Collection many-to-many relationship
 */
@Entity('product_collection_map')
@Index('unique_product_collection', ['product_id', 'collection_id'], { unique: true })
@Index('idx_pcm_collection_position', ['collection_id', 'position'])
export class ProductCollectionMap {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    @Index('IDX_PCM_PRODUCT_ID')
    product_id: string;

    @Column({ type: 'uuid' })
    @Index('IDX_PCM_COLLECTION_ID')
    collection_id: string;

    @Column({ type: 'int', default: 0 })
    position: number;

    @CreateDateColumn()
    added_at: Date;

    @ManyToOne(() => Product, (product) => product.collectionMaps, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => Collection, (collection) => collection.products, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'collection_id' })
    collection: Collection;
}
