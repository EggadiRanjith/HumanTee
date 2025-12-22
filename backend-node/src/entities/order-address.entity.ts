import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    CreateDateColumn,
    JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('order_addresses')
export class OrderAddress {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'order_id', unique: true })
    orderId: string;

    @OneToOne(() => Order, (order) => order.address, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    // Address snapshot (NOT a relation to shipping_addresses)
    @Column({ name: 'full_name' })
    fullName: string;

    @Column()
    phone: string;

    @Column()
    email: string;

    @Column({ name: 'address_line_1' })
    addressLine1: string;

    @Column({ name: 'address_line_2', nullable: true })
    addressLine2: string;

    @Column({ nullable: true })
    landmark: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column({ name: 'postal_code' })
    postalCode: string;

    @Column()
    country: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
