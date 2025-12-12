/**
 * Customer Account Dashboard
 * Server component that displays customer profile and order history
 */

import { redirect } from 'next/navigation';
import { getCustomerSession } from '@/app/lib/customer-session';
import { getCustomerOrders, getCustomerProfile } from '@/app/lib/shopify-customer';
import AccountClient from './AccountClient';

export const dynamic = 'force-dynamic';

// Type definitions for Customer Account API responses
interface CustomerProfileResponse {
    customer: {
        id: string;
        emailAddress: { emailAddress: string };
        firstName: string;
        lastName: string;
        phoneNumber?: { phoneNumber: string };
        defaultAddress?: {
            address1: string;
            address2?: string;
            city: string;
            province: string;
            country: string;
            zip: string;
        };
    };
}

interface CustomerOrdersResponse {
    customer: {
        orders: {
            edges: Array<{
                node: {
                    id: string;
                    name: string;
                    orderNumber: number;
                    processedAt: string;
                    financialStatus: string;
                    fulfillmentStatus: string;
                    totalPrice: { amount: string; currencyCode: string };
                    lineItems: {
                        edges: Array<{
                            node: {
                                title: string;
                                quantity: number;
                                price: { amount: string; currencyCode: string };
                                image: { url: string; altText: string };
                            };
                        }>;
                    };
                };
            }>;
        };
    };
}

export default async function AccountPage() {
    const session = await getCustomerSession();

    // Redirect to login if not authenticated
    if (!session) {
        redirect('/login');
    }

    try {
        // Fetch customer data
        const [profileData, ordersData] = await Promise.all([
            getCustomerProfile(session.accessToken) as Promise<CustomerProfileResponse>,
            getCustomerOrders(session.accessToken, 20) as Promise<CustomerOrdersResponse>,
        ]);

        return (
            <AccountClient
                customer={profileData.customer}
                orders={ordersData.customer.orders.edges}
                session={session}
            />
        );
    } catch (error) {
        console.error('Failed to load account data:', error);

        // If token is expired, redirect to login
        redirect('/login?error=session_expired');
    }
}
