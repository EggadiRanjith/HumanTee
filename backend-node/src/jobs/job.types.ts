/**
 * Job Status
 */
export enum JobStatus {
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
}

/**
 * Job Type
 */
export enum JobType {
    CRON = 'cron',           // Scheduled cron job
    QUEUE = 'queue',         // Queue worker job
    SCHEDULED = 'scheduled', // One-time scheduled job
}

/**
 * Job Execution Result
 */
export interface JobResult {
    success: boolean;
    duration: number;
    error?: string;
    metadata?: any;
}
