/**
 * System Jobs Page (PRODUCTION-GRADE)
 * Monitor all background jobs
 * CRITICAL: This is the operational visibility layer
 */

'use client';

import { useState, useMemo } from 'react';

// Mock data - replace with API call
const mockJobs = [
    {
        id: '1',
        jobName: 'cleanup-temp-images',
        jobType: 'cron',
        status: 'SUCCESS',
        startedAt: new Date('2024-12-20T00:00:00'),
        completedAt: new Date('2024-12-20T00:02:15'),
        durationMs: 135000,
        errorMessage: null,
    },
    {
        id: '2',
        jobName: 'sync-inventory',
        jobType: 'cron',
        status: 'FAILED',
        startedAt: new Date('2024-12-20T01:00:00'),
        completedAt: new Date('2024-12-20T01:00:30'),
        durationMs: 30000,
        errorMessage: 'Connection timeout to inventory service',
    },
    {
        id: '3',
        jobName: 'cleanup-old-drafts',
        jobType: 'cron',
        status: 'SUCCESS',
        startedAt: new Date('2024-12-20T06:00:00'),
        completedAt: new Date('2024-12-20T06:00:45'),
        durationMs: 45000,
        errorMessage: null,
    },
    {
        id: '4',
        jobName: 'weekly-report',
        jobType: 'cron',
        status: 'RUNNING',
        startedAt: new Date('2024-12-20T09:00:00'),
        completedAt: null,
        durationMs: null,
        errorMessage: null,
    },
];

const mockJobStats = {
    'cleanup-temp-images': { total: 30, success: 29, failed: 1, successRate: 96.7, avgDuration: 120000 },
    'sync-inventory': { total: 24, success: 20, failed: 4, successRate: 83.3, avgDuration: 35000 },
    'cleanup-old-drafts': { total: 5, success: 5, failed: 0, successRate: 100, avgDuration: 42000 },
    'weekly-report': { total: 4, success: 4, failed: 0, successRate: 100, avgDuration: 180000 },
};

export default function SystemJobsPage() {
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedJob, setSelectedJob] = useState<string | null>(null);

    // Filtered jobs
    const filteredJobs = useMemo(() => {
        if (statusFilter === 'ALL') return mockJobs;
        return mockJobs.filter((job) => job.status === statusFilter);
    }, [statusFilter]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SUCCESS':
                return 'bg-green-100 text-green-700';
            case 'FAILED':
                return 'bg-red-100 text-red-700';
            case 'RUNNING':
                return 'bg-blue-100 text-blue-700';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const formatDuration = (ms: number | null) => {
        if (!ms) return 'N/A';
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        }
        return `${seconds}s`;
    };

    const handleRetry = (jobId: string) => {
        // TODO: API call to retry job
        console.log(`Retrying job ${jobId}`);
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-black">System Jobs</h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Monitor background job executions
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Total Jobs</div>
                    <div className="text-lg sm:text-2xl font-semibold text-black">{mockJobs.length}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Success</div>
                    <div className="text-lg sm:text-2xl font-semibold text-green-600">
                        {mockJobs.filter((j) => j.status === 'SUCCESS').length}
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Failed</div>
                    <div className="text-lg sm:text-2xl font-semibold text-red-600">
                        {mockJobs.filter((j) => j.status === 'FAILED').length}
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Running</div>
                    <div className="text-lg sm:text-2xl font-semibold text-blue-600">
                        {mockJobs.filter((j) => j.status === 'RUNNING').length}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                >
                    <option value="ALL">All Status</option>
                    <option value="SUCCESS">Success</option>
                    <option value="FAILED">Failed</option>
                    <option value="RUNNING">Running</option>
                    <option value="PENDING">Pending</option>
                </select>
            </div>

            {/* Jobs Table (Desktop) */}
            <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Job Name
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Status
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Started
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Duration
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredJobs.map((job) => (
                            <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-black font-mono">
                                        {job.jobName}
                                    </div>
                                    <div className="text-xs text-gray-500">{job.jobType}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                                            job.status
                                        )}`}
                                    >
                                        {job.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {job.startedAt.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {formatDuration(job.durationMs)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setSelectedJob(job.jobName)}
                                            className="text-sm text-black hover:underline font-medium"
                                        >
                                            View Stats
                                        </button>
                                        {job.status === 'FAILED' && (
                                            <button
                                                onClick={() => handleRetry(job.id)}
                                                className="text-sm text-blue-600 hover:underline font-medium"
                                            >
                                                Retry
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Jobs Cards (Mobile) */}
            <div className="lg:hidden space-y-3">
                {filteredJobs.map((job) => (
                    <div key={job.id} className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <div className="text-sm font-medium text-black font-mono">{job.jobName}</div>
                                <div className="text-xs text-gray-500 mt-1">{job.jobType}</div>
                            </div>
                            <span
                                className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(job.status)}`}
                            >
                                {job.status}
                            </span>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                            Started: {job.startedAt.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600 mb-3">
                            Duration: {formatDuration(job.durationMs)}
                        </div>
                        {job.errorMessage && (
                            <div className="text-xs text-red-600 mb-3 p-2 bg-red-50 rounded">
                                {job.errorMessage}
                            </div>
                        )}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedJob(job.jobName)}
                                className="text-sm text-black hover:underline font-medium"
                            >
                                View Stats
                            </button>
                            {job.status === 'FAILED' && (
                                <button
                                    onClick={() => handleRetry(job.id)}
                                    className="text-sm text-blue-600 hover:underline font-medium"
                                >
                                    Retry
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Job Stats Modal */}
            {selectedJob && mockJobStats[selectedJob as keyof typeof mockJobStats] && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-lg w-full">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-black font-mono">{selectedJob}</h2>
                                <button
                                    onClick={() => setSelectedJob(null)}
                                    className="text-gray-500 hover:text-black"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            {(() => {
                                const stats = mockJobStats[selectedJob as keyof typeof mockJobStats];
                                return (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="border border-gray-200 rounded-lg p-4">
                                                <div className="text-sm text-gray-600 mb-1">Total Runs</div>
                                                <div className="text-2xl font-semibold text-black">{stats.total}</div>
                                            </div>
                                            <div className="border border-gray-200 rounded-lg p-4">
                                                <div className="text-sm text-gray-600 mb-1">Success Rate</div>
                                                <div className="text-2xl font-semibold text-green-600">
                                                    {stats.successRate}%
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="border border-gray-200 rounded-lg p-4">
                                                <div className="text-sm text-gray-600 mb-1">Successful</div>
                                                <div className="text-2xl font-semibold text-green-600">
                                                    {stats.success}
                                                </div>
                                            </div>
                                            <div className="border border-gray-200 rounded-lg p-4">
                                                <div className="text-sm text-gray-600 mb-1">Failed</div>
                                                <div className="text-2xl font-semibold text-red-600">
                                                    {stats.failed}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="border border-gray-200 rounded-lg p-4">
                                            <div className="text-sm text-gray-600 mb-1">Avg Duration</div>
                                            <div className="text-2xl font-semibold text-black">
                                                {formatDuration(stats.avgDuration)}
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {filteredJobs.length === 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <div className="text-4xl mb-4">⚙️</div>
                    <h3 className="text-lg font-medium text-black mb-2">No jobs found</h3>
                    <p className="text-sm text-gray-600 mb-4">Try adjusting your filters</p>
                    <button
                        onClick={() => setStatusFilter('ALL')}
                        className="text-sm text-black hover:underline font-medium"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
}
