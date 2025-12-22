import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateOrderSystemTables1734850000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Create orders table
        await queryRunner.createTable(
            new Table({
                name: 'orders',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'order_number',
                        type: 'varchar',
                        isUnique: true,
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['pending_payment', 'payment_failed', 'processing', 'shipped', 'delivered', 'cancelled'],
                        default: "'pending_payment'",
                    },
                    {
                        name: 'subtotal',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'tax_amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'shipping_amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'discount_amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'total_amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'currency',
                        type: 'varchar',
                        length: '3',
                        default: "'INR'",
                    },
                    {
                        name: 'completed_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        // 2. Create order_items table
        await queryRunner.createTable(
            new Table({
                name: 'order_items',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'order_id',
                        type: 'uuid',
                    },
                    {
                        name: 'product_id',
                        type: 'uuid',
                    },
                    {
                        name: 'variant_id',
                        type: 'uuid',
                    },
                    {
                        name: 'product_name_snapshot',
                        type: 'varchar',
                    },
                    {
                        name: 'variant_label_snapshot',
                        type: 'varchar',
                    },
                    {
                        name: 'sku_snapshot',
                        type: 'varchar',
                    },
                    {
                        name: 'image_url_snapshot',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'quantity',
                        type: 'int',
                    },
                    {
                        name: 'unit_price',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'tax_amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'discount_amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'line_total',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        // 3. Create order_addresses table
        await queryRunner.createTable(
            new Table({
                name: 'order_addresses',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'order_id',
                        type: 'uuid',
                        isUnique: true,
                    },
                    {
                        name: 'full_name',
                        type: 'varchar',
                    },
                    {
                        name: 'phone',
                        type: 'varchar',
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                    },
                    {
                        name: 'address_line_1',
                        type: 'varchar',
                    },
                    {
                        name: 'address_line_2',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'landmark',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'city',
                        type: 'varchar',
                    },
                    {
                        name: 'state',
                        type: 'varchar',
                    },
                    {
                        name: 'postal_code',
                        type: 'varchar',
                    },
                    {
                        name: 'country',
                        type: 'varchar',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        // 4. Create payments table
        await queryRunner.createTable(
            new Table({
                name: 'payments',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'order_id',
                        type: 'uuid',
                    },
                    {
                        name: 'provider',
                        type: 'varchar',
                        default: "'razorpay'",
                    },
                    {
                        name: 'provider_payment_id',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'provider_order_id',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'refunded_amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'currency',
                        type: 'varchar',
                        length: '3',
                        default: "'INR'",
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['initiated', 'pending', 'authorized', 'captured', 'failed'],
                        default: "'initiated'",
                    },
                    {
                        name: 'payment_method',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'failure_reason',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        // 5. Create shipments table
        await queryRunner.createTable(
            new Table({
                name: 'shipments',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'order_id',
                        type: 'uuid',
                    },
                    {
                        name: 'carrier',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'tracking_number',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['shipped', 'delivered'],
                        default: "'shipped'",
                    },
                    {
                        name: 'shipped_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'delivered_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        // 6. Create order_status_history table
        await queryRunner.createTable(
            new Table({
                name: 'order_status_history',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'order_id',
                        type: 'uuid',
                    },
                    {
                        name: 'from_status',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'to_status',
                        type: 'varchar',
                    },
                    {
                        name: 'changed_by',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'reason',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        // Add foreign keys
        await queryRunner.createForeignKey(
            'orders',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'auth_users',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'order_items',
            new TableForeignKey({
                columnNames: ['order_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'orders',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'order_addresses',
            new TableForeignKey({
                columnNames: ['order_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'orders',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'payments',
            new TableForeignKey({
                columnNames: ['order_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'orders',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'shipments',
            new TableForeignKey({
                columnNames: ['order_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'orders',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'order_status_history',
            new TableForeignKey({
                columnNames: ['order_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'orders',
                onDelete: 'CASCADE',
            }),
        );

        // Add indexes for performance
        await queryRunner.createIndex(
            'orders',
            new TableIndex({
                name: 'IDX_ORDERS_USER_CREATED',
                columnNames: ['user_id', 'created_at'],
            }),
        );

        await queryRunner.createIndex(
            'order_items',
            new TableIndex({
                name: 'IDX_ORDER_ITEMS_ORDER',
                columnNames: ['order_id'],
            }),
        );

        await queryRunner.createIndex(
            'payments',
            new TableIndex({
                name: 'IDX_PAYMENTS_ORDER_STATUS',
                columnNames: ['order_id', 'status'],
            }),
        );

        await queryRunner.createIndex(
            'order_status_history',
            new TableIndex({
                name: 'IDX_STATUS_HISTORY_ORDER',
                columnNames: ['order_id', 'created_at'],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop tables in reverse order
        await queryRunner.dropTable('order_status_history');
        await queryRunner.dropTable('shipments');
        await queryRunner.dropTable('payments');
        await queryRunner.dropTable('order_addresses');
        await queryRunner.dropTable('order_items');
        await queryRunner.dropTable('orders');
    }
}
