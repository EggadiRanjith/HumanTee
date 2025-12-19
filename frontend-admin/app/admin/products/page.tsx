import Link from 'next/link';

/**
 * Products List Page
 * Clean, professional, mobile-responsive
 * Mobile: Card grid
 * Desktop: Table view
 */

// Mock data - replace with actual API call
async function getProducts() {
    // TODO: Implement actual API call
    return {
        products: [],
        total: 0,
        page: 1,
        limit: 20,
    };
}

export default async function ProductsPage() {
    const { products } = await getProducts();

    return (
        <div>
            {/* Header */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-black">Products</h1>
                    <p className="text-sm text-gray-600 mt-1">Manage your product catalog</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                    + Add Product
                </Link>
            </div>

            {/* Empty State */}
            {products.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <div className="text-4xl mb-4">👕</div>
                    <h3 className="text-lg font-medium text-black mb-2">No products yet</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Start by adding your first product to the catalog
                    </p>
                    <Link
                        href="/admin/products/new"
                        className="inline-block bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        Add Your First Product
                    </Link>
                </div>
            ) : (
                <>
                    {/* Mobile: Card Grid */}
                    <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {products.map((product: any) => (
                            <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="aspect-square bg-gray-100" />
                                <div className="p-4">
                                    <h3 className="font-medium text-black mb-1">{product.name}</h3>
                                    <p className="text-sm text-gray-600 mb-2">₹{product.price}</p>
                                    <Link
                                        href={`/admin/products/${product.id}`}
                                        className="text-sm text-black hover:underline"
                                    >
                                        Edit →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop: Table View */}
                    <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                        Product
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                        Price
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                        Stock
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                        Status
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {products.map((product: any) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded" />
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">₹{product.price}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{product.stock}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                                                {product.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/admin/products/${product.id}`}
                                                className="text-sm text-black hover:underline font-medium"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
