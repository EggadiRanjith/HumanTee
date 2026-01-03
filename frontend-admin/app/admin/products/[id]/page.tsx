/**
 * Product Detail Page - Preview Mode
 * Shows product exactly as customers see it
 */

'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { ProductPreview } from './components';
import { useRouter } from 'next/navigation';

interface ProductDetailPageProps {
    params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { id } = use(params);
    const router = useRouter();

    // Fetch product data
    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const response = await apiClient.get(`/admin/products/${id}`);
            return response.data;
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading product...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Failed to load product</p>
                    <button
                        onClick={() => window.history.back()}
                        className="text-black hover:underline"
                    >
                        ← Back to Products
                    </button>
                </div>
            </div>
        );
    }

    // Navigate to edit page (you can create this later)
    const handleEdit = () => {
        router.push(`/admin/products/${id}/edit`);
    };

    return (
        <ProductPreview
            product={product}
            onEdit={handleEdit}
        />
    );
}
