/**
 * EXAMPLE: How to use Job Monitoring
 * 
 * This shows how to track background jobs automatically
 */

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MonitoredJob } from '../jobs/decorators/monitored-job.decorator';
import { JobMonitorService } from '../jobs/job-monitor.service';
import { JobType } from '../jobs/job.types';

@Injectable()
export class ExampleJobsService {
    constructor(
        private readonly jobMonitor: JobMonitorService, // REQUIRED: Inject this
    ) { }

    /**
     * Example 1: Daily cron job
     * Runs every day at midnight
     */
    @Cron('0 0 * * *', { name: 'cleanup-temp-images' })
    @MonitoredJob('cleanup-temp-images', JobType.CRON)
    async cleanupTempImages() {
        console.log('Cleaning up temp images...');

        // Job logic here
        const deleted = await this.deleteOldTempImages();

        console.log(`Deleted ${deleted} temp images`);
        return { deleted };
    }

    /**
     * Example 2: Hourly cron job
     * Runs every hour
     */
    @Cron(CronExpression.EVERY_HOUR, { name: 'sync-inventory' })
    @MonitoredJob('sync-inventory', JobType.CRON)
    async syncInventory() {
        console.log('Syncing inventory...');

        // Job logic here
        const synced = await this.syncProductInventory();

        console.log(`Synced ${synced} products`);
        return { synced };
    }

    /**
     * Example 3: Weekly report
     * Runs every Monday at 9 AM
     */
    @Cron('0 9 * * 1', { name: 'weekly-report' })
    @MonitoredJob('weekly-report', JobType.CRON)
    async generateWeeklyReport() {
        console.log('Generating weekly report...');

        // Job logic here
        const report = await this.createWeeklyReport();

        console.log('Weekly report generated');
        return { report };
    }

    /**
     * Example 4: Cleanup old drafts
     * Runs every 6 hours
     */
    @Cron('0 */6 * * *', { name: 'cleanup-old-drafts' })
    @MonitoredJob('cleanup-old-drafts', JobType.CRON)
    async cleanupOldDrafts() {
        console.log('Cleaning up old drafts...');

        // Job logic here
        const deleted = await this.deleteExpiredDrafts();

        console.log(`Deleted ${deleted} expired drafts`);
        return { deleted };
    }

    // Helper methods (implement these)
    private async deleteOldTempImages(): Promise<number> {
        // Implementation
        return 0;
    }

    private async syncProductInventory(): Promise<number> {
        // Implementation
        return 0;
    }

    private async createWeeklyReport(): Promise<any> {
        // Implementation
        return {};
    }

    private async deleteExpiredDrafts(): Promise<number> {
        // Implementation
        return 0;
    }
}

/**
 * What happens when a job runs:
 * 
 * 1. @MonitoredJob decorator intercepts the call
 * 2. Creates a record in background_jobs table (status: RUNNING)
 * 3. Executes the job
 * 4. On success: Updates status to SUCCESS, records duration
 * 5. On failure: Updates status to FAILED, records error message
 * 
 * Admins can then:
 * - See all job executions
 * - View success/failure rates
 * - See error messages
 * - Retry failed jobs
 */

/**
 * Job Monitoring Benefits:
 * 
 * ✅ Visibility: See all job executions
 * ✅ Debugging: Error messages and stack traces
 * ✅ Alerting: Detect failures immediately
 * ✅ Performance: Track execution times
 * ✅ Reliability: Ensure jobs are running
 * ✅ Audit: Complete history of job runs
 */
