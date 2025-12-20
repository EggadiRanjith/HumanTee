import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

/**
 * CRITICAL: Settings History & Rollback
 * Prevents production outages from bad configurations
 */
export class CreateSettingsHistory1734676200000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create settings_history table
        await queryRunner.createTable(
            new Table({
                name: 'settings_history',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'admin_id',
                        type: 'uuid',
                        isNullable: false,
                        comment: 'Admin who made the change',
                    },
                    {
                        name: 'settings',
                        type: 'jsonb',
                        isNullable: false,
                        comment: 'Complete settings snapshot',
                    },
                    {
                        name: 'is_active',
                        type: 'boolean',
                        default: false,
                        comment: 'Currently active configuration',
                    },
                    {
                        name: 'validation_passed',
                        type: 'boolean',
                        default: true,
                        comment: 'Whether validation passed',
                    },
                    {
                        name: 'test_passed',
                        type: 'boolean',
                        default: true,
                        comment: 'Whether test configuration passed',
                    },
                    {
                        name: 'notes',
                        type: 'text',
                        isNullable: true,
                        comment: 'Admin notes about this change',
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

        // Create indexes
        await queryRunner.createIndex(
            'settings_history',
            new TableIndex({
                name: 'IDX_SETTINGS_HISTORY_IS_ACTIVE',
                columnNames: ['is_active'],
            }),
        );

        await queryRunner.createIndex(
            'settings_history',
            new TableIndex({
                name: 'IDX_SETTINGS_HISTORY_CREATED_AT',
                columnNames: ['created_at'],
            }),
        );

        // Add foreign key
        await queryRunner.query(`
            ALTER TABLE settings_history
            ADD CONSTRAINT FK_SETTINGS_HISTORY_ADMIN
            FOREIGN KEY (admin_id) REFERENCES users(id)
            ON DELETE CASCADE
        `);

        // Insert initial settings (default configuration)
        await queryRunner.query(`
            INSERT INTO settings_history (admin_id, settings, is_active, notes)
            SELECT 
                id,
                '{
                    "storeName": "HumanTee",
                    "storeEmail": "contact@humantee.com",
                    "currency": "INR",
                    "timezone": "Asia/Kolkata",
                    "lowStockThreshold": 10,
                    "enableRazorpay": false,
                    "razorpayKeyId": "",
                    "enableCOD": true,
                    "codCharge": 50,
                    "freeShippingThreshold": 1000,
                    "standardShippingRate": 100,
                    "expressShippingRate": 200,
                    "orderConfirmationEmail": true,
                    "orderShippedEmail": true,
                    "lowStockAlert": true
                }'::jsonb,
                true,
                'Initial default settings'
            FROM users
            WHERE is_admin = true
            LIMIT 1
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE settings_history DROP CONSTRAINT IF EXISTS FK_SETTINGS_HISTORY_ADMIN`);
        await queryRunner.dropIndex('settings_history', 'IDX_SETTINGS_HISTORY_CREATED_AT');
        await queryRunner.dropIndex('settings_history', 'IDX_SETTINGS_HISTORY_IS_ACTIVE');
        await queryRunner.dropTable('settings_history');
    }
}
