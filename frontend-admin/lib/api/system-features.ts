import apiClient from '../api-client';

export interface SystemFeatures {
    auditLogsEnabled: boolean;
    auditLogsDisabledSince?: string;
    discountsEnabled: boolean;
    discountsDisabledSince?: string;
    ticketsEnabled: boolean;
    ticketsDisabledSince?: string;
}

/**
 * Get system features status
 */
export async function getSystemFeatures(): Promise<SystemFeatures> {
    const response = await apiClient.get('/admin/settings/system-features');
    return response.data;
}

/**
 * Update system features
 */
export async function updateSystemFeatures(data: Partial<SystemFeatures>): Promise<void> {
    await apiClient.post('/admin/settings/system-features', data);
}
