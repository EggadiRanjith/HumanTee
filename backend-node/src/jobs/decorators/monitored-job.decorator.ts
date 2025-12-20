import { JobMonitorService } from '../job-monitor.service';
import { JobType } from '../job.types';

/**
 * Monitored Job Decorator
 * Automatically tracks job execution
 * CRITICAL: Use this on all background jobs
 * 
 * @example
 * @Cron('0 0 * * *')
 * @MonitoredJob('cleanup-temp-images', JobType.CRON)
 * async cleanupTempImages() {
 *   // Job logic
 * }
 */
export function MonitoredJob(jobName: string, jobType: JobType = JobType.CRON) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            // Get job monitor service from instance
            const jobMonitor: JobMonitorService = this.jobMonitor || this.jobMonitorService;

            if (!jobMonitor) {
                console.error(`JobMonitorService not found in ${target.constructor.name}`);
                // Still execute the job
                return originalMethod.apply(this, args);
            }

            // Start tracking
            const jobId = await jobMonitor.start(jobName, jobType);

            try {
                // Execute job
                const result = await originalMethod.apply(this, args);

                // Mark as success
                await jobMonitor.success(jobId, { result });

                return result;
            } catch (error) {
                // Mark as failed
                await jobMonitor.fail(
                    jobId,
                    error.message,
                    error.stack,
                );

                // Re-throw error
                throw error;
            }
        };

        return descriptor;
    };
}
