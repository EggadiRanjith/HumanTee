/**
 * Shipping & Taxes Settings
 * Manage shipping zones and tax configuration
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiSave } from 'react-icons/fi';
import { useAdminSettings } from '@/lib/queries/useSettings';
import { settingsApi } from '@/lib/api/settings';

interface ShippingZone {
    id: string;
    name: string;
    icon: string;
    pincodes: string[];
    rate: number;
    freeShippingThreshold: number | null;
    isActive: boolean;
}

export default function ShippingTaxesSettings() {
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showZoneModal, setShowZoneModal] = useState(false);
    const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);

    // Use React Query hook - automatic caching and loading states
    const { data, isLoading } = useAdminSettings('shipping');

    // Indian States Shipping Zones
    const [zones, setZones] = useState<ShippingZone[]>([]);

    // Tax settings
    const [taxEnabled, setTaxEnabled] = useState(true);
    const [taxRate, setTaxRate] = useState<number | ''>('');
    const [taxLabel, setTaxLabel] = useState('GST');
    const [taxInclusive, setTaxInclusive] = useState(false);

    // Zone form state
    const [zoneName, setZoneName] = useState('');
    const [zoneIcon, setZoneIcon] = useState('📦');
    const [zonePincodes, setZonePincodes] = useState('');
    const [zoneRate, setZoneRate] = useState<number | string>('');
    const [zoneFreeThreshold, setZoneFreeThreshold] = useState<number | string>('');

    // Update local state when data loads
    useEffect(() => {
        if (data) {
            if (data.zones && Array.isArray(data.zones)) {
                setZones(data.zones);
            }
            if (data.tax) {
                setTaxEnabled(data.tax.enabled ?? true);
                setTaxRate(data.tax.rate ?? '');
                setTaxLabel(data.tax.label ?? 'GST');
                setTaxInclusive(data.tax.inclusive ?? false);
            }
        }
    }, [data]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await settingsApi.saveSection('shipping', {
                zones: zones,
                tax: {
                    enabled: taxEnabled,
                    rate: taxRate === '' ? 0 : Number(taxRate),
                    label: taxLabel,
                    inclusive: taxInclusive
                }
            });

            setIsEditing(false);
            alert('Shipping & tax settings saved successfully!');
        } catch (error) {
            // Failed to save settings
            alert('Failed to save settings. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddZone = () => {
        setEditingZone(null);
        setZoneName('');
        setZoneIcon('📦');
        setZonePincodes('');
        setZoneRate('');
        setZoneFreeThreshold('');
        setShowZoneModal(true);
    };

    const handleEditZone = (zone: ShippingZone) => {
        setEditingZone(zone);
        setZoneName(zone.name);
        setZoneIcon(zone.icon);
        setZonePincodes(zone.pincodes.join('\n'));
        setZoneRate(zone.rate);
        setZoneFreeThreshold(zone.freeShippingThreshold || '');
        setShowZoneModal(true);
    };

    const handleDeleteZone = (id: string) => {
        if (confirm('Are you sure you want to delete this zone?')) {
            setZones(zones.filter(z => z.id !== id));
        }
    };

    const handleSaveZone = () => {
        const newZone: ShippingZone = {
            id: editingZone?.id || Date.now().toString(),
            name: zoneName,
            icon: zoneIcon,
            pincodes: zonePincodes.split('\n').filter(p => p.trim()),
            rate: Number(zoneRate),
            freeShippingThreshold: zoneFreeThreshold ? Number(zoneFreeThreshold) : null,
            isActive: true
        };

        if (editingZone) {
            setZones(zones.map(z => z.id === editingZone.id ? newZone : z));
        } else {
            setZones([...zones, newZone]);
        }
        setShowZoneModal(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <Link
                    href="/admin/settings"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors"
                >
                    <FiArrowLeft size={20} />
                    <span className="text-sm font-medium">Back to Settings</span>
                </Link>

                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shipping & Taxes</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Configure shipping zones and tax settings
                        </p>
                    </div>

                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm"
                        >
                            Edit
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2 transition-colors font-medium shadow-sm"
                            >
                                {isSaving ? (
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <FiSave size={18} />
                                )}
                                {isSaving ? 'Saving...' : 'Save All'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Shipping Zones Section */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Shipping Zones</h2>
                                <p className="text-sm text-gray-600 mt-1">Manage pincode-based shipping rates</p>
                            </div>
                            {isEditing && (
                                <button
                                    onClick={handleAddZone}
                                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    <FiPlus size={16} />
                                    Add Zone
                                </button>
                            )}
                        </div>

                        {/* Zones Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Zone</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Pincodes</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rate</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Free @</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Active</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {zones.map((zone) => (
                                        <tr key={zone.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl">{zone.icon}</span>
                                                    <span className="font-medium text-gray-900">{zone.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {zone.pincodes.slice(0, 3).map((pin, i) => (
                                                        <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-mono rounded">
                                                            {pin}
                                                        </span>
                                                    ))}
                                                    {zone.pincodes.length > 3 && (
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                                            +{zone.pincodes.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="font-semibold text-gray-900">₹{zone.rate}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-gray-600">
                                                    {zone.freeShippingThreshold ? `₹${zone.freeShippingThreshold}` : '-'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <label className={`relative inline-flex items-center ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={zone.isActive}
                                                        onChange={() => {
                                                            if (isEditing) {
                                                                setZones(zones.map(z =>
                                                                    z.id === zone.id ? { ...z, isActive: !z.isActive } : z
                                                                ));
                                                            }
                                                        }}
                                                        disabled={!isEditing}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                                                </label>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                {isEditing && (
                                                    <div className="flex items-center justify-end gap-2 text-right">
                                                        <button
                                                            onClick={() => handleEditZone(zone)}
                                                            className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded transition-colors"
                                                        >
                                                            <FiEdit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteZone(zone.id)}
                                                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        >
                                                            <FiTrash2 size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Tax Settings Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="border-b border-gray-200 pb-4 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Tax Settings</h2>
                            <p className="text-sm text-gray-600 mt-1">Configure tax rates and display</p>
                        </div>

                        <div className="space-y-6">
                            {/* Enable Tax */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Enable Taxes</p>
                                    <p className="text-xs text-gray-500 mt-1">Apply taxes to all orders</p>
                                </div>
                                <label className={`relative inline-flex items-center ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
                                    <input
                                        type="checkbox"
                                        checked={taxEnabled}
                                        onChange={(e: any) => isEditing && setTaxEnabled(e.target.checked)}
                                        disabled={!isEditing}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                </label>
                            </div>

                            {taxEnabled && (
                                <>
                                    {/* Tax Rate */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tax Rate (%)
                                            </label>
                                            <input
                                                type="number"
                                                value={taxRate}
                                                onChange={(e: any) => {
                                                    const val = e.target.value;
                                                    setTaxRate(val === '' ? '' : Number(val));
                                                }}
                                                readOnly={!isEditing}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black disabled:bg-gray-50 disabled:cursor-not-allowed"
                                                placeholder="18"
                                                min="0"
                                                max="100"
                                                step="0.01"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tax Label
                                            </label>
                                            <input
                                                type="text"
                                                value={taxLabel}
                                                onChange={(e: any) => setTaxLabel(e.target.value)}
                                                readOnly={!isEditing}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black disabled:bg-gray-50 disabled:cursor-not-allowed"
                                                placeholder="GST"
                                            />
                                        </div>
                                    </div>

                                    {/* Tax Display */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Price Display
                                        </label>
                                        <div className="space-y-2">
                                            <label className={`flex items-center gap-3 p-3 border border-gray-200 rounded-lg ${isEditing ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed bg-gray-50'}`}>
                                                <input
                                                    type="radio"
                                                    checked={!taxInclusive}
                                                    onChange={() => isEditing && setTaxInclusive(false)}
                                                    disabled={!isEditing}
                                                    className="w-4 h-4"
                                                />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Tax Exclusive</p>
                                                    <p className="text-xs text-gray-500">Tax added at checkout (e.g., ₹1000 + ₹180 GST)</p>
                                                </div>
                                            </label>
                                            <label className={`flex items-center gap-3 p-3 border border-gray-200 rounded-lg ${isEditing ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed bg-gray-50'}`}>
                                                <input
                                                    type="radio"
                                                    checked={taxInclusive}
                                                    onChange={() => isEditing && setTaxInclusive(true)}
                                                    disabled={!isEditing}
                                                    className="w-4 h-4"
                                                />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Tax Inclusive</p>
                                                    <p className="text-xs text-gray-500">Tax included in price (e.g., ₹1180 incl. GST)</p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>


            </div>

            {/* Zone Modal */}
            {showZoneModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {editingZone ? 'Edit Zone' : 'Add Zone'}
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Zone Name
                                    </label>
                                    <input
                                        type="text"
                                        value={zoneName}
                                        onChange={(e: any) => setZoneName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                                        placeholder="e.g., Metro Cities"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Icon (Emoji)
                                    </label>
                                    <input
                                        type="text"
                                        value={zoneIcon}
                                        onChange={(e: any) => setZoneIcon(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-2xl"
                                        placeholder="🌆"
                                        maxLength={2}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Pincode Patterns (one per line)
                                    </label>
                                    <textarea
                                        value={zonePincodes}
                                        onChange={(e: any) => setZonePincodes(e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black font-mono text-sm"
                                        placeholder="110001-110099&#10;400*&#10;560*"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Supports wildcards (*) and ranges (110001-110099)
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Shipping Rate (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={zoneRate}
                                        onChange={(e: any) => setZoneRate(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                                        placeholder="80"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Free Shipping Threshold (₹, optional)
                                    </label>
                                    <input
                                        type="number"
                                        value={zoneFreeThreshold}
                                        onChange={(e: any) => setZoneFreeThreshold(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                                        placeholder="2500"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowZoneModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveZone}
                                    className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                                >
                                    {editingZone ? 'Update' : 'Add'} Zone
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
