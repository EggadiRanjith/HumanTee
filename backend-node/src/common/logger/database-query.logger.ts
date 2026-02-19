/**
 * Database Query Logger
 * Intercepts TypeORM queries to track performance
 * 
 * Add to app.module.ts TypeORM config:
 * logging: true,
 * logger: new DatabaseQueryLogger()
 */

import { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';
import { Logger } from '@nestjs/common';
import { trackDBQuery } from '../middleware/performance.middleware';

export class DatabaseQueryLogger implements TypeOrmLogger {
    private readonly logger = new Logger('DatabaseQuery');

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
        const startTime = Date.now();

        // Track query execution time
        if (queryRunner) {
            const originalQuery = queryRunner.query.bind(queryRunner);
            queryRunner.query = async function (...args) {
                const result = await originalQuery.apply(this, args);
                const duration = Date.now() - startTime;
                trackDBQuery(duration);
                return result;
            };
        }

        // Log slow queries
        const duration = Date.now() - startTime;
        if (duration > 100) {
        }
    }

    logQueryError(error: string, query: string, parameters?: any[]) {
    }

    logQuerySlow(time: number, query: string, parameters?: any[]) {
    }

    logSchemaBuild(message: string) {
    }

    logMigration(message: string) {
    }

    log(level: 'log' | 'info' | 'warn', message: any) {
        if (level === 'warn') {
        } else {
        }
    }
}
