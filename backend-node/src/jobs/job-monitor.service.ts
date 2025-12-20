import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { BackgroundJob } from './entities/background-job.entity';
import { JobStatus, JobType, JobResult } from './job.types';

/**
 * Job Monitor Service
 * Tracks and monitors all background jobs
 * CRITICAL: Prevents silent failures
 */
@Injectable()
export class JobMonitorService {
    constructor(
        @InjectRepository(BackgroundJob)
        private readonly jobRepo: Repository<BackgroundJob>,
    ) { }

    /**
     * Start tracking a job
     * Returns job ID for later updates
     */
    async start(jobName: string, jobType: JobType = JobType.CRON, metadata?: any): Promise<string> {
        const job = this.jobRepo.create({
            job_name: jobName,
            job_type: jobType,
            status: JobStatus.RUNNING,
            started_at: new Date(),
            metadata,
        });

        const saved = await this.jobRepo.save(job);
        return saved.id;
    }

    /**
     * Mark job as successful
     */
    async success(jobId: string, metadata?: any): Promise<void> {
        const job = await this.jobRepo.findOne({ where: { id: jobId } });

        if (!job) {
            console.error(`Job ${jobId} not found`);
            return;
        }

        const duration = job.started_at
            ? Date.now() - job.started_at.getTime()
            : 0;

        await this.jobRepo.update(jobId, {
            status: JobStatus.SUCCESS,
            completed_at: new Date(),
            duration_ms: duration,
            metadata: metadata || job.metadata,
        });
    }

    /**
     * Mark job as failed
     */
    async fail(jobId: string, error: string, stack?: string): Promise<void> {
        const job = await this.jobRepo.findOne({ where: { id: jobId } });

        if (!job) {
            console.error(`Job ${jobId} not found`);
            return;
        }

        const duration = job.started_at
            ? Date.now() - job.started_at.getTime()
            : 0;

        await this.jobRepo.update(jobId, {
            status: JobStatus.FAILED,
            completed_at: new Date(),
            duration_ms: duration,
            error_message: error,
            error_stack: stack,
        });
    }

    /**
     * Get job history
     */
    async getHistory(filters: {
        jobName?: string;
        status?: JobStatus;
        startDate?: Date;
        endDate?: Date;
        limit?: number;
    }): Promise<BackgroundJob[]> {
        const query = this.jobRepo.createQueryBuilder('job');

        if (filters.jobName) {
            query.andWhere('job.job_name = :jobName', { jobName: filters.jobName });
        }

        if (filters.status) {
            query.andWhere('job.status = :status', { status: filters.status });
        }

        if (filters.startDate && filters.endDate) {
            query.andWhere('job.created_at BETWEEN :startDate AND :endDate', {
                startDate: filters.startDate,
                endDate: filters.endDate,
            });
        }

        query.orderBy('job.created_at', 'DESC');

        if (filters.limit) {
            query.limit(filters.limit);
        }

        return query.getMany();
    }

    /**
     * Get last run for a job
     */
    async getLastRun(jobName: string): Promise<BackgroundJob | null> {
        return this.jobRepo.findOne({
            where: { job_name: jobName },
            order: { created_at: 'DESC' },
        });
    }

    /**
     * Get job statistics
     */
    async getStatistics(jobName?: string): Promise<{
        total: number;
        success: number;
        failed: number;
        running: number;
        successRate: number;
        avgDuration: number;
    }> {
        const query = this.jobRepo.createQueryBuilder('job');

        if (jobName) {
            query.where('job.job_name = :jobName', { jobName });
        }

        const jobs = await query.getMany();

        const total = jobs.length;
        const success = jobs.filter(j => j.status === JobStatus.SUCCESS).length;
        const failed = jobs.filter(j => j.status === JobStatus.FAILED).length;
        const running = jobs.filter(j => j.status === JobStatus.RUNNING).length;
        const successRate = total > 0 ? (success / total) * 100 : 0;

        const completedJobs = jobs.filter(j => j.duration_ms !== null);
        const avgDuration = completedJobs.length > 0
            ? completedJobs.reduce((sum, j) => sum + (j.duration_ms || 0), 0) / completedJobs.length
            : 0;

        return {
            total,
            success,
            failed,
            running,
            successRate,
            avgDuration,
        };
    }

    /**
     * Get failed jobs (for alerting)
     */
    async getRecentFailures(hours: number = 24): Promise<BackgroundJob[]> {
        const since = new Date(Date.now() - hours * 60 * 60 * 1000);

        return this.jobRepo.find({
            where: {
                status: JobStatus.FAILED,
                created_at: Between(since, new Date()),
            },
            order: {
                created_at: 'DESC',
            },
        });
    }

    /**
     * Cleanup old job records
     * Keep last 30 days
     */
    async cleanup(daysToKeep: number = 30): Promise<number> {
        const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);

        const result = await this.jobRepo
            .createQueryBuilder()
            .delete()
            .where('created_at < :cutoffDate', { cutoffDate })
            .execute();

        return result.affected || 0;
    }
}
