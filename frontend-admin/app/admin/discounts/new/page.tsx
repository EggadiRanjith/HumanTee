/**
 * Create/Edit Discount Page (FRONTEND-ONLY)
 * 
 * CRITICAL RULES:
 * - NO price calculation
 * - NO checkout simulation
 * - NO product price mutation
 * - Preview is VISUAL ONLY with clear disclaimer
 * - Stores IDs only, not prices
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type DiscountType = 'PERCENT' | 'FLAT';
type DiscountScope = 'PRODUCT' | 'GROUP';

export default function CreateDiscountPage() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [type, setType] = useState<DiscountType>('PERCENT');
    const [value, setValue] = useState(0);
    const [scope, setScope] = useState<DiscountScope>('PRODUCT');
    const [priority, setPriority] = useState(1);
    const [stackable, setStackable] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Mock product data (UI only - stores IDs, not prices)
    const mockProducts = [
        { id: 'prod_1', name: 'Premium Cotton T-Shirt' },
        { id: 'prod_2', name: 'Classic Hoodie' },
        { id: 'prod_3', name: 'Vintage Tee' },
    ];

    const mockGroups = [
        { id: 'drop1', name: 'Drop 1' },
        { id: 'drop2', name: 'Drop 2' },
        { id: 'drop3', name: 'Drop 3' },
    ];

    const handleSave = () => {
        // UI-only: Just collect data, no logic
        const discountData = {
            name,
            type,
            value,
            scope,
            priority,
            stackable,
            productIds: scope === 'PRODUCT' ? selectedProducts : [],
            groupId: scope === 'GROUP' ? selectedGroup : null,
            startDate,
            endDate,
        };

        console.log('Discount data (UI-only):', discountData);
        alert('Discount created! (UI-only, no backend)');
        router.push('/admin/discounts');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link
                    href="/admin/discounts"
                    className="text-sm text-gray-600 hover:text-black mb-3 inline-block"
                >
                    ← Back to discounts
                </Link>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-semibold text-black">Create Discount</h1>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            Configure discount rules
                        </p>
                    </div>
                    <button
                        onClick={handleSave}
                        className="bg-black hover:bg-gray-900 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
                    >
                        Save Discount
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Discount Basics */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-black mb-4">Discount Basics</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Discount Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Diwali Sale"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Discount Type
                                    </label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value as DiscountType)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
                                    >
                                        <option value="PERCENT">Percentage (%)</option>
                                        <option value="FLAT">Flat Amount (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Discount Value
                                    </label>
                                    <input
                                        type="number"
                                        value={value}
                                        onChange={(e) => setValue(Number(e.target.value))}
                                        placeholder={type === 'PERCENT' ? '20' : '500'}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Priority
                                    </label>
                                    <input
                                        type="number"
                                        value={priority}
                                        onChange={(e) => setPriority(Number(e.target.value))}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
                                    />
                                    <p className="text-xs text-gray-600 mt-1">Higher priority applies first</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Stackable
                                    </label>
                                    <label className="relative inline-flex items-center cursor-pointer mt-2">
                                        <input
                                            type="checkbox"
                                            checked={stackable}
                                            onChange={(e) => setStackable(e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                        <span className="ml-3 text-sm text-gray-600">Can combine with other discounts</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Apply To */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-black mb-4">Apply To</h2>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="scope"
                                        value="PRODUCT"
                                        checked={scope === 'PRODUCT'}
                                        onChange={(e) => setScope(e.target.value as DiscountScope)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-black">Specific Products</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="scope"
                                        value="GROUP"
                                        checked={scope === 'GROUP'}
                                        onChange={(e) => setScope(e.target.value as DiscountScope)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-black">Product Group</span>
                                </label>
                            </div>

                            {scope === 'PRODUCT' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Select Products
                                    </label>
                                    <div className="space-y-2">
                                        {mockProducts.map((product) => (
                                            <label key={product.id} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProducts.includes(product.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedProducts([...selectedProducts, product.id]);
                                                        } else {
                                                            setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                                                        }
                                                    }}
                                                    className="mr-3"
                                                />
                                                <span className="text-sm text-black">{product.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-600 mt-2">
                                        ⚠️ UI stores product IDs only, not prices
                                    </p>
                                </div>
                            )}

                            {scope === 'GROUP' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Select Collection
                                    </label>
                                    <select
                                        value={selectedGroup}
                                        onChange={(e) => setSelectedGroup(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
                                    >
                                        <option value="">Choose a collection...</option>
                                        {mockGroups.map((group) => (
                                            <option key={group.id} value={group.id}>
                                                {group.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Validity */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-black mb-4">Validity Period</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Start Date
                                </label>
                                <input
                                    type="datetime-local"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    End Date
                                </label>
                                <input
                                    type="datetime-local"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
                        <h2 className="text-lg font-semibold text-black mb-4">Preview</h2>

                        {/* CRITICAL: Visual preview only with disclaimer */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                            <p className="text-xs text-yellow-700">
                                ⚠️ <strong>Preview only.</strong> Final price calculated at checkout.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Sample product price:</span>
                                <span className="text-black font-medium">₹1,299</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Discount applied:</span>
                                <span className="text-green-600 font-medium">
                                    −₹{type === 'PERCENT' ? Math.round(1299 * value / 100) : value}
                                </span>
                            </div>
                            <div className="pt-3 border-t border-gray-200">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Display price:</span>
                                    <span className="text-lg font-semibold text-black">
                                        ₹{type === 'PERCENT'
                                            ? (1299 - Math.round(1299 * value / 100)).toLocaleString()
                                            : (1299 - value).toLocaleString()
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <h3 className="text-sm font-medium text-black mb-2">Summary</h3>
                            <div className="space-y-1 text-xs text-gray-600">
                                <div>Type: {type === 'PERCENT' ? 'Percentage' : 'Flat Amount'}</div>
                                <div>Value: {type === 'PERCENT' ? `${value}%` : `₹${value}`}</div>
                                <div>Scope: {scope === 'PRODUCT' ? 'Specific Products' : 'Product Group'}</div>
                                <div>Priority: {priority}</div>
                                <div>Stackable: {stackable ? 'Yes' : 'No'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
