import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
} from 'typeorm';
import { JobStatus, JobType } from '../job.types';

/**
 * Background Job Entity
 * Tracks all background job executions
 */
@Entity('background_jobs')
export class BackgroundJob {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    @Index('IDX_BACKGROUND_JOBS_JOB_NAME')
    job_name: string;

    @Column({ type: 'varchar', length: 50 })
    job_type: JobType;

    @Column({ type: 'enum', enum: JobStatus, default: JobStatus.PENDING })
    @Index('IDX_BACKGROUND_JOBS_STATUS')
    status: JobStatus;

    @Column({ type: 'timestamp', nullable: true })
    @Index('IDX_BACKGROUND_JOBS_STARTED_AT')
    started_at?: Date;

    @Column({ type: 'timestamp', nullable: true })
    completed_at?: Date;

    @Column({ type: 'int', nullable: true })
    duration_ms?: number;

    @Column({ type: 'text', nullable: true })
    error_message?: string;

    @Column({ type: 'text', nullable: true })
    error_stack?: string;

    @Column({ type: 'jsonb', nullable: true })
    metadata?: any;

    @CreateDateColumn()
    @Index('IDX_BACKGROUND_JOBS_CREATED_AT')
    created_at: Date;
}
