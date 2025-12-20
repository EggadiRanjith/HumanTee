import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

/**
 * CRITICAL: Audit Logging System
 * Tracks all admin actions for accountability and debugging
 */
export class CreateAuditLogsTable1734676000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create audit_logs table
        await queryRunner.createTable(
            new Table({
                name: 'audit_logs',
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
                    },
                    {
                        name: 'admin_email',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'event_type',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                        comment: 'PRODUCT_UPDATED, PRICE_CHANGED, etc.',
                    },
                    {
                        name: 'entity_type',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                        comment: 'product, order, customer, settings',
                    },
                    {
                        name: 'entity_id',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                        comment: 'UUID or identifier of affected entity',
                    },
                    {
                        name: 'before',
                        type: 'jsonb',
                        isNullable: true,
                        comment: 'Previous state',
                    },
                    {
                        name: 'after',
                        type: 'jsonb',
                        isNullable: true,
                        comment: 'New state',
                    },
                    {
                        name: 'changes',
                        type: 'jsonb',
                        isNullable: true,
                        comment: 'Diff of what changed',
                    },
                    {
                        name: 'ip_address',
                        type: 'varchar',
                        length: '45',
                        isNullable: true,
                        comment: 'IPv4 or IPv6',
                    },
                    {
                        name: 'user_agent',
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

        // Create indexes for efficient queries
        await queryRunner.createIndex(
            'audit_logs',
            new TableIndex({
                name: 'IDX_AUDIT_LOGS_ADMIN_ID',
                columnNames: ['admin_id'],
            }),
        );

        await queryRunner.createIndex(
            'audit_logs',
            new TableIndex({
                name: 'IDX_AUDIT_LOGS_ENTITY',
                columnNames: ['entity_type', 'entity_id'],
            }),
        );

        await queryRunner.createIndex(
            'audit_logs',
            new TableIndex({
                name: 'IDX_AUDIT_LOGS_EVENT_TYPE',
                columnNames: ['event_type'],
            }),
        );

        await queryRunner.createIndex(
            'audit_logs',
            new TableIndex({
                name: 'IDX_AUDIT_LOGS_CREATED_AT',
                columnNames: ['created_at'],
            }),
        );

        // Add foreign key to users table
        await queryRunner.query(`
            ALTER TABLE audit_logs
            ADD CONSTRAINT FK_AUDIT_LOGS_ADMIN
            FOREIGN KEY (admin_id) REFERENCES users(id)
            ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE audit_logs DROP CONSTRAINT IF EXISTS FK_AUDIT_LOGS_ADMIN`);
        await queryRunner.dropIndex('audit_logs', 'IDX_AUDIT_LOGS_CREATED_AT');
        await queryRunner.dropIndex('audit_logs', 'IDX_AUDIT_LOGS_EVENT_TYPE');
        await queryRunner.dropIndex('audit_logs', 'IDX_AUDIT_LOGS_ENTITY');
        await queryRunner.dropIndex('audit_logs', 'IDX_AUDIT_LOGS_ADMIN_ID');
        await queryRunner.dropTable('audit_logs');
    }
}
