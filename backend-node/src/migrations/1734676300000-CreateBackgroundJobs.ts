import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

/**
 * CRITICAL: Background Job Monitoring
 * Prevents silent failures in cron jobs and async tasks
 */
export class CreateBackgroundJobs1734676300000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create job_status enum
        await queryRunner.query(`
            CREATE TYPE "job_status" AS ENUM ('PENDING', 'RUNNING', 'SUCCESS', 'FAILED')
        `);

        // Create background_jobs table
        await queryRunner.createTable(
            new Table({
                name: 'background_jobs',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'job_name',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                        comment: 'Unique job identifier',
                    },
                    {
                        name: 'job_type',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                        comment: 'cron, queue, scheduled',
                    },
                    {
                        name: 'status',
                        type: 'job_status',
                        isNullable: false,
                        default: "'PENDING'",
                    },
                    {
                        name: 'started_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'completed_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'duration_ms',
                        type: 'int',
                        isNullable: true,
                        comment: 'Execution time in milliseconds',
                    },
                    {
                        name: 'error_message',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'error_stack',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'metadata',
                        type: 'jsonb',
                        isNullable: true,
                        comment: 'Additional job data',
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
            'background_jobs',
            new TableIndex({
                name: 'IDX_BACKGROUND_JOBS_JOB_NAME',
                columnNames: ['job_name'],
            }),
        );

        await queryRunner.createIndex(
            'background_jobs',
            new TableIndex({
                name: 'IDX_BACKGROUND_JOBS_STATUS',
                columnNames: ['status'],
            }),
        );

        await queryRunner.createIndex(
            'background_jobs',
            new TableIndex({
                name: 'IDX_BACKGROUND_JOBS_STARTED_AT',
                columnNames: ['started_at'],
            }),
        );

        await queryRunner.createIndex(
            'background_jobs',
            new TableIndex({
                name: 'IDX_BACKGROUND_JOBS_CREATED_AT',
                columnNames: ['created_at'],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex('background_jobs', 'IDX_BACKGROUND_JOBS_CREATED_AT');
        await queryRunner.dropIndex('background_jobs', 'IDX_BACKGROUND_JOBS_STARTED_AT');
        await queryRunner.dropIndex('background_jobs', 'IDX_BACKGROUND_JOBS_STATUS');
        await queryRunner.dropIndex('background_jobs', 'IDX_BACKGROUND_JOBS_JOB_NAME');
        await queryRunner.dropTable('background_jobs');
        await queryRunner.query(`DROP TYPE IF EXISTS "job_status"`);
    }
}
