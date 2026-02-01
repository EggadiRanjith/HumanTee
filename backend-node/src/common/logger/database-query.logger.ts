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
            this.logger.warn(`🐌 SLOW QUERY (${duration}ms): ${query.substring(0, 100)}...`);
        }
    }

    logQueryError(error: string, query: string, parameters?: any[]) {
        this.logger.error(`❌ QUERY ERROR: ${error}\nQuery: ${query}`);
    }

    logQuerySlow(time: number, query: string, parameters?: any[]) {
        this.logger.warn(`🐌 SLOW QUERY (${time}ms): ${query.substring(0, 100)}...`);
    }

    logSchemaBuild(message: string) {
        this.logger.log(`📐 Schema: ${message}`);
    }

    logMigration(message: string) {
        this.logger.log(`🔄 Migration: ${message}`);
    }

    log(level: 'log' | 'info' | 'warn', message: any) {
        if (level === 'warn') {
            this.logger.warn(message);
        } else {
            this.logger.log(message);
        }
    }
}
