/**
 * Contact API Client
 * Handles contact form submissions to the backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://humantee.onrender.com';

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

/**
 * Submit contact form to backend
 * POST /api/contact
 */
export async function submitContactForm(data: ContactFormData): Promise<ContactResponse> {
    const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to send message' }));
        throw new Error(error.message || 'Failed to send message. Please try again.');
    }

    return response.json();
}
