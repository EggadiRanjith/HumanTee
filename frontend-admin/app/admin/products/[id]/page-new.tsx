/**
 * Product Detail Page - Dual Mode Wrapper
 * Default: Preview Mode (customer view)
 * Edit Mode: Full admin form
 */

'use client';

import { use, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { ProductPreview } from './components/ProductPreview';
// import { ProductEditForm } from './components/ProductEditForm';

interface ProductDetailPageProps {
    params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { id } = use(params);
    const [isEditMode, setIsEditMode] = useState(false);

    // Fetch product data
    const { data: product, isLoading, error, refetch } = useQuery({
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

    // Handle save from edit mode
    const handleSave = async () => {
        await refetch();
        setIsEditMode(false);
    };

    // Handle cancel from edit mode
    const handleCancel = () => {
        setIsEditMode(false);
    };

    // Toggle between modes
    // TODO: Implement ProductEditForm component
    // if (isEditMode) {
    //     return (
    //         <ProductEditForm
    //             productId={id}
    //             product={product}
    //             onSave={handleSave}
    //             onCancel={handleCancel}
    //         />
    //     );
    // }

    return (
        <ProductPreview
            product={product}
            onEdit={() => setIsEditMode(true)}
        />
    );
}
