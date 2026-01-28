/**
 * Contact API Client
 * Uses apiClient for all backend calls.
 */

import apiClient from '@/lib/api-client';

export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export interface ContactResponse {
    success: boolean;
    message: string;
}

export async function submitContactForm(data: ContactFormData): Promise<ContactResponse> {
    const res = await apiClient.post<ContactResponse>('/contact', data);
    return res.data;
}
