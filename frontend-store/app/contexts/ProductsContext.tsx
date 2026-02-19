'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchProducts } from '@/lib/app/api/products';
import { adaptProducts } from '@/lib/app/adapters/product.adapter';
import { Product } from '@/app/types/product.types';

interface ProductsContextType {
    products: Product[];
    loading: boolean;
    error: string | null;
}

const ProductsContext = createContext<ProductsContextType>({
    products: [],
    loading: true,
    error: null
});

export function ProductsProvider({ children }: { children: ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadProducts() {
            try {
                const apiProducts = await fetchProducts();
                const adaptedProducts = adaptProducts(apiProducts);
                setProducts(adaptedProducts);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadProducts();
    }, []);

    return (
        <ProductsContext.Provider value={{ products, loading, error }}>
            {children}
        </ProductsContext.Provider>
    );
}

export const useProducts = () => useContext(ProductsContext);
