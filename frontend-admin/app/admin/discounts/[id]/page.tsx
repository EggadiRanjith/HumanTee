/**
 * Edit Discount Page
 * Full-featured discount editing with exact same UI as create page
 * 
 * CRITICAL RULES:
 * - NO price calculation
 * - NO checkout simulation
 * - NO product price mutation
 * - Preview is VISUAL ONLY with clear disclaimer
 * - Stores IDs only, not prices
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { discountsApi } from '@/lib/api/discounts';
import { getAllProducts } from '@/lib/api/products';

type DiscountType = 'PERCENT' | 'FLAT';
type DiscountScope = 'PRODUCT' | 'GROUP' | 'GLOBAL';

export default function EditDiscountPage() {
    const router = useRouter();
    const params = useParams();
    const discountId = params.id as string;

    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isDataLoading, setIsDataLoading] = useState(true);

    // Core Fields
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<DiscountType>('PERCENT');
    const [value, setValue] = useState<number | string>('');
    const [priority, setPriority] = useState<number | string>(1);
    const [stackable, setStackable] = useState(false);

    // Audience & Limits
    const [audience, setAudience] = useState('ALL');
    const [minOrder, setMinOrder] = useState<number | string>('');
    const [minUserOrders, setMinUserOrders] = useState<number | string>('');
    const [minUserLtv, setMinUserLtv] = useState<number | string>('');
    const [globalLimit, setGlobalLimit] = useState<number | string>('');
    const [perUserLimit, setPerUserLimit] = useState<number | string>(1);

    // Scope & Targets
    const [scope, setScope] = useState<DiscountScope>('PRODUCT');
    const [groupType, setGroupType] = useState('COLLECTION'); // COLLECTION, TYPE, CATEGORY
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState('');

    // Backend Data
    const [realProducts, setRealProducts] = useState<any[]>([]);
    const [realCollections, setRealCollections] = useState<any[]>([]);

    // Filter states
    const [prodSearch, setProdSearch] = useState('');
    const [prodType, setProdType] = useState('ALL');
    const [prodCategory, setProdCategory] = useState('ALL');
    const [prodCollection, setProdCollection] = useState('ALL');

    // Load existing discount data
    useEffect(() => {
        const loadDiscount = async () => {
            try {
                setIsInitialLoading(true);
                const discount = await discountsApi.getOne(discountId);

                // Pre-fill all fields
                setName(discount.name || '');
                setCode(discount.code || '');
                setDescription(discount.description || '');
                setType(discount.type || 'PERCENT');
                setValue(discount.value || '');
                setPriority(discount.priority || 1);
                setStackable(discount.isStackable || false);
                setAudience(discount.audience || 'ALL');
                setMinOrder(discount.minOrderAmount || '');
                setMinUserOrders(discount.minUserOrders || '');
                setMinUserLtv(discount.minUserLtv || '');
                setGlobalLimit(discount.globalUsageLimit || '');
                setPerUserLimit(discount.perUserLimit || 1);
                setScope(discount.scope || 'PRODUCT');

                if (discount.startDate) {
                    setStartDate(new Date(discount.startDate).toISOString().split('T')[0]);
                }
                if (discount.endDate) {
                    setEndDate(new Date(discount.endDate).toISOString().split('T')[0]);
                }

                // Load targets
                if (discount.targetGroups && discount.targetGroups.length > 0) {
                    const firstGroup = discount.targetGroups[0];
                    if (firstGroup.groupType === 'PRODUCT') {
                        setScope('PRODUCT');
                        setSelectedProducts(discount.targetGroups.map((g: any) => g.groupValueUuid));
                    } else {
                        setScope('GROUP');
                        setGroupType(firstGroup.groupType);
                        setSelectedGroups(discount.targetGroups.map((g: any) => g.groupValueText || g.groupValueUuid));
                    }
                }
            } catch (error) {
                console.error('Failed to load discount:', error);
                alert('Failed to load discount');
            } finally {
                setIsInitialLoading(false);
            }
        };

        if (discountId) {
            loadDiscount();
        }
    }, [discountId]);

    // Load products and collections
    useEffect(() => {
        async function fetchData() {
            try {
                const [prods, colls] = await Promise.all([
                    getAllProducts(),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/collections`).then(r => r.json())
                ]);
                setRealProducts(prods);
                setRealCollections(colls);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setIsDataLoading(false);
            }
        }
        fetchData();
    }, []);

    const dynamicGroups = useMemo(() => {
        const types = Array.from(new Set(realProducts.map(p => p.productType))).filter(Boolean);
        const cats = Array.from(new Set(realProducts.map(p => p.category))).filter(Boolean);

        return {
            COLLECTION: Array.isArray(realCollections) ? realCollections.map(c => ({
                id: c.id,
                name: c.name,
                count: realProducts.filter(p => p.collections?.some((pc: any) => pc.id === c.id)).length
            })) : [],
            TYPE: types.map(t => ({ id: t, name: t, count: realProducts.filter(p => p.productType === t).length })),
            CATEGORY: cats.map(c => ({ id: c, name: c, count: realProducts.filter(p => p.category === c).length }))
        };
    }, [realProducts, realCollections]);

    const filteredProducts = useMemo(() => {
        return realProducts.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(prodSearch.toLowerCase());
            const matchesType = prodType === 'ALL' || p.productType === prodType;
            const matchesCategory = prodCategory === 'ALL' || p.category === prodCategory;
            const matchesCollection = prodCollection === 'ALL' || p.collections?.some((c: any) => c.id === prodCollection);
            return matchesSearch && matchesType && matchesCategory && matchesCollection;
        });
    }, [realProducts, prodSearch, prodType, prodCategory, prodCollection]);

    const handleSave = async () => {
        if (!name || !code || !value) {
            alert('Please fill in Name, Code, and Value');
            return;
        }

        // Hardening Validation
        if (type === 'PERCENT' && (Number(value) < 0 || Number(value) > 100)) {
            alert('Percentage value must be between 0 and 100');
            return;
        }
        if (Number(value) < 0) {
            alert('Discount value cannot be negative');
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                name,
                code: code.toUpperCase(),
                description,
                type,
                value: Number(value),
                scope,
                audience: audience === 'LOYAL' ? 'FREQUENT' : audience,
                minOrderAmount: Number(minOrder) || 0,
                minUserOrders: Number(minUserOrders) || 0,
                minUserLtv: Number(minUserLtv) || 0,
                globalUsageLimit: globalLimit === '' ? null : Number(globalLimit),
                perUserLimit: Number(perUserLimit) || 1,
                priority: Number(priority) || 1,
                isStackable: stackable,
                startDate: new Date(startDate).toISOString(),
                endDate: endDate ? new Date(endDate).toISOString() : null,
                isActive: true,
                selectedProducts: scope === 'PRODUCT' ? selectedProducts : [],
                targetGroups: scope === 'GROUP' ? selectedGroups.map(id => ({
                    groupType,
                    groupValue: id
                })) : []
            };

            await discountsApi.update(discountId, payload);
            alert('Discount successfully updated! 🚀');
            router.push('/admin/discounts');
        } catch (error: any) {
            console.error('Update failed:', error);
            alert(error.response?.data?.message || 'Failed to update discount');
        } finally {
            setIsLoading(false);
        }
    };

    if (isInitialLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading discount...</p>
                </div>
            </div>
        );
    }

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
                        <h1 className="text-xl sm:text-2xl font-semibold text-black">Edit Discount</h1>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            Update discount rules (Live Connection)
                        </p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className={`${isLoading ? 'bg-gray-400' : 'bg-black hover:bg-gray-900'} text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm flex items-center gap-2`}
                    >
                        {isLoading && (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                        {isLoading ? 'Updating...' : 'Update Discount'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Discount Basics */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-black mb-4">Discount Basics</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Welcome Offer"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Discount Code
                                </label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    placeholder="e.g., SAVE20"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none font-mono"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Internal Description (Notes)
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Administrative notes about this discount..."
                                rows={2}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
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
                                    Value {type === 'PERCENT' ? '(Max 100%)' : '(₹)'}
                                </label>
                                <input
                                    type="number"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value === '' ? '' : Number(e.target.value))}
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
                                    onChange={(e) => setPriority(e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
                                />
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
                                    <span className="ml-3 text-sm text-gray-600">Can combine with others</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Rules & Audience */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-black mb-4">Rules & Audience</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Target Audience
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {['ALL', 'NEW', 'TOP', 'LOYAL'].map((aud) => (
                                        <button
                                            key={aud}
                                            onClick={() => setAudience(aud)}
                                            className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${audience === aud
                                                ? 'bg-black text-white border-black shadow-md'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-black'
                                                }`}
                                        >
                                            {aud === 'LOYAL' ? 'Most Orders' : aud === 'TOP' ? 'Top Spenders' : aud === 'NEW' ? 'New Users' : 'All Users'}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-2 space-y-1">
                                    {audience === 'NEW' && <p className="text-[10px] text-gray-500 italic">Targeting users with 0 previous orders.</p>}
                                    {audience === 'TOP' && <p className="text-[10px] text-gray-500 italic">Targeting users based on lifetime spend threshold.</p>}
                                    {audience === 'LOYAL' && <p className="text-[10px] text-gray-500 italic">Targeting users with high order frequency.</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Min Order (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={minOrder}
                                        onChange={(e) => setMinOrder(e.target.value === '' ? '' : Number(e.target.value))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none"
                                    />
                                </div>
                                {audience === 'LOYAL' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2 text-blue-600">
                                            Min Previous Orders
                                        </label>
                                        <input
                                            type="number"
                                            value={minUserOrders}
                                            onChange={(e) => setMinUserOrders(e.target.value === '' ? '' : Number(e.target.value))}
                                            placeholder="e.g., 5"
                                            className="w-full px-4 py-2 border border-blue-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none bg-blue-50/30"
                                        />
                                    </div>
                                )}
                                {audience === 'TOP' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2 text-blue-600">
                                            Min Lifetime Spend (₹)
                                        </label>
                                        <input
                                            type="number"
                                            value={minUserLtv}
                                            onChange={(e) => setMinUserLtv(e.target.value === '' ? '' : Number(e.target.value))}
                                            placeholder="e.g., 10000"
                                            className="w-full px-4 py-2 border border-blue-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none bg-blue-50/30"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Global Usage Limit
                                    </label>
                                    <input
                                        type="number"
                                        value={globalLimit}
                                        onChange={(e) => setGlobalLimit(e.target.value === '' ? '' : Number(e.target.value))}
                                        placeholder="No limit"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Uses Per User
                                    </label>
                                    <input
                                        type="number"
                                        value={perUserLimit}
                                        onChange={(e) => setPerUserLimit(e.target.value === '' ? '' : Number(e.target.value))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scope / Apply To */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-black mb-4">Apply To</h2>
                        <div className="space-y-4">
                            <div className="flex gap-4 mb-4">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="scope"
                                        value="PRODUCT"
                                        checked={scope === 'PRODUCT'}
                                        onChange={(e) => setScope(e.target.value as DiscountScope)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm font-medium text-gray-900">Specific Products</span>
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
                                    <span className="text-sm font-medium text-gray-900">Product Groups</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="scope"
                                        value="GLOBAL"
                                        checked={scope === 'GLOBAL'}
                                        onChange={(e) => setScope(e.target.value as DiscountScope)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm font-medium text-gray-900">All Products</span>
                                </label>
                            </div>

                            {scope === 'PRODUCT' && (
                                <div className="space-y-4">
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-3">
                                        <div className="text-xs font-semibold text-gray-500 uppercase">Filters</div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                placeholder="Search products..."
                                                value={prodSearch}
                                                onChange={(e) => setProdSearch(e.target.value)}
                                                className="px-3 py-1.5 border border-gray-200 rounded-md text-xs outline-none focus:border-black"
                                            />
                                            <div className="grid grid-cols-2 gap-2">
                                                <select
                                                    value={prodType}
                                                    onChange={(e) => setProdType(e.target.value)}
                                                    className="px-3 py-1.5 border border-gray-200 rounded-md text-xs outline-none bg-white"
                                                >
                                                    <option value="ALL">All Types</option>
                                                    {Array.from(new Set(realProducts.map(p => p.productType))).filter(Boolean).map(t => (
                                                        <option key={t} value={t}>{t}</option>
                                                    ))}
                                                </select>
                                                <select
                                                    value={prodCategory}
                                                    onChange={(e) => setProdCategory(e.target.value)}
                                                    className="px-3 py-1.5 border border-gray-200 rounded-md text-xs outline-none bg-white"
                                                >
                                                    <option value="ALL">All Categories</option>
                                                    {Array.from(new Set(realProducts.map(p => p.category))).filter(Boolean).map(c => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <select
                                            value={prodCollection}
                                            onChange={(e) => setProdCollection(e.target.value)}
                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-xs outline-none bg-white"
                                        >
                                            <option value="ALL">All Collections</option>
                                            {Array.isArray(realCollections) && realCollections.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1 bg-white">
                                        {isDataLoading ? (
                                            <div className="text-center py-10">
                                                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                                <p className="text-xs text-gray-500">Fetching live products...</p>
                                            </div>
                                        ) : filteredProducts.length > 0 ? (
                                            filteredProducts.map((product) => (
                                                <label key={product.id} className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors border border-transparent hover:border-gray-100">
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
                                                        className="mr-3 rounded border-gray-300 text-black focus:ring-black"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-medium text-black truncate">{product.name}</div>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded uppercase font-bold">{product.productType}</span>
                                                            <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase font-bold">{product.category}</span>
                                                            {product.collections?.map((c: any) => (
                                                                <span key={c.id} className="text-[9px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded uppercase font-bold">{c.name}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </label>
                                            ))
                                        ) : (
                                            <div className="text-center py-6 text-sm text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                                No products match filters
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-gray-600 px-1">
                                        <span>Selected: {selectedProducts.length} items</span>
                                        {selectedProducts.length > 0 && (
                                            <button
                                                onClick={() => setSelectedProducts([])}
                                                className="text-red-600 hover:text-red-700 font-medium"
                                            >
                                                Clear All
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {scope === 'GROUP' && (
                                <div className="space-y-4">
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-3">
                                        <div className="text-xs font-semibold text-gray-500 uppercase">Group By</div>
                                        <div className="flex gap-2">
                                            {['COLLECTION', 'TYPE', 'CATEGORY'].map((gt) => (
                                                <button
                                                    key={gt}
                                                    onClick={() => {
                                                        setGroupType(gt);
                                                        setSelectedGroups([]);
                                                    }}
                                                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold border transition-all ${groupType === gt
                                                        ? 'bg-black text-white border-black'
                                                        : 'bg-white text-gray-600 border-gray-200'
                                                        }`}
                                                >
                                                    {gt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {isDataLoading ? (
                                            <div className="p-4 text-center text-xs text-gray-500">Loading...</div>
                                        ) : (dynamicGroups as any)[groupType]?.map((group: any) => (
                                            <label key={group.id} className="flex items-center p-3 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedGroups.includes(group.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedGroups([...selectedGroups, group.id]);
                                                        } else {
                                                            setSelectedGroups(selectedGroups.filter(id => id !== group.id));
                                                        }
                                                    }}
                                                    className="mr-3 rounded border-gray-300 text-black focus:ring-black"
                                                />
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium text-black">{group.name}</div>
                                                    <div className="text-[10px] text-gray-500 mt-0.5">
                                                        {group.count === 'Live' ? 'Dynamic collection' : `${group.count} Products`}
                                                    </div>
                                                </div>
                                                <div className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold">
                                                    {groupType}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Validity Period */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-black mb-4">Validity Period</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    End Date (Optional)
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Preview */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
                        <h2 className="text-lg font-semibold text-black mb-4">Preview</h2>

                        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mb-6">
                            <p className="text-[10px] text-yellow-700 leading-tight">
                                🛡️ <strong>Production Protocol:</strong> This discount will be applied securely by the backend logic. Preview is for visual reference only.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="text-[10px] text-gray-500 uppercase font-black mb-1">Coupon Preview</div>
                                <div className="text-xl font-mono font-bold text-black tracking-tighter">
                                    {code || 'COUPON_CODE'}
                                </div>
                                <div className="text-2xl font-black text-green-600 mt-1">
                                    {type === 'PERCENT' ? `${value || 0}% OFF` : `₹${value || 0} OFF`}
                                </div>
                            </div>

                            <div className="space-y-2 border-t border-gray-100 pt-4">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Target Audience</span>
                                    <span className="font-bold text-black">{audience}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Min Order</span>
                                    <span className="font-bold text-black">₹{minOrder || 0}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Scope</span>
                                    <span className="font-bold text-black">
                                        {scope === 'PRODUCT' ? `${selectedProducts.length} Items` : `${selectedGroups.length} Groups`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Stackable</span>
                                    <span className={`font-bold ${stackable ? 'text-green-600' : 'text-gray-400'}`}>
                                        {stackable ? 'YES' : 'NO'}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-black text-white p-3 rounded-lg text-center">
                                <div className="text-[10px] opacity-70">Starts on</div>
                                <div className="text-sm font-bold">{startDate || 'Today'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}