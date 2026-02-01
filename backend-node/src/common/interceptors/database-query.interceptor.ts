import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

/**
 * Database Query Interceptor
 * Tracks all TypeORM queries and associates them with the current request
 * Counts queries per request and measures query execution time
 */
@Injectable()
export class DatabaseQueryInterceptor implements OnModuleInit {
    private readonly logger = new Logger('DatabaseQuery');
    private originalQuery: any;

    constructor(@InjectDataSource() private dataSource: DataSource) { }

    onModuleInit() {
        // Store original query method
        this.originalQuery = this.dataSource.query.bind(this.dataSource);

        // Intercept all queries
        const self = this;
        this.dataSource.query = async function (query: string, parameters?: any[]) {
            const startTime = Date.now();

            try {
                // Execute query
                const result = await self.originalQuery(query, parameters);
                const duration = Date.now() - startTime;

                // Get current request from global context
                const req = (global as any).currentRequest;
                if (req) {
                    req.dbQueryCount++;
                    req.dbQueryTime += duration;

                    // Store query details (limit to first 200 chars to avoid huge logs)
                    req.dbQueries.push({
                        query: query.substring(0, 200),
                        params: parameters ? parameters.slice(0, 5) : [], // First 5 params only
                        duration: `${duration}ms`,
                        durationMs: duration,
                        timestamp: new Date().toISOString()
                    });
                }

                // Log slow queries (>100ms)
                if (duration > 100) {
                    self.logger.warn(`🐌 SLOW QUERY (${duration}ms): ${query.substring(0, 100)}...`);
                }

                return result;
            } catch (error) {
                self.logger.error(`❌ QUERY ERROR: ${error.message}`);
                self.logger.error(`   Query: ${query.substring(0, 100)}...`);
                throw error;
            }
        };

        this.logger.log('✅ Database query interceptor enabled');
    }
}
