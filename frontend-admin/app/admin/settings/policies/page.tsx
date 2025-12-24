"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiChevronLeft, FiSave, FiX } from "react-icons/fi";
import { settingsApi } from "@/lib/api/settings";

type Section = { title: string; points: string[] };

export default function PoliciesSettingsPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'shipping' | 'terms' | 'privacy'>('shipping');

    const [shippingData, setShippingData] = useState({
        effective_date: "",
        intro_text: "",
        sections: [] as Section[]
    });

    const [policiesData, setPoliciesData] = useState({
        effective_date: "",
        intro_text: "",
        privacy_sections: [] as Section[],
        terms_sections: [] as Section[]
    });

    // Load settings on mount
    useEffect(() => {
        Promise.all([
            settingsApi.getSection('shipping'),
            settingsApi.getSection('policies')
        ])
            .then(([shipping, policies]) => {
                setShippingData({
                    effective_date: shipping?.effective_date || "",
                    intro_text: shipping?.intro_text || "",
                    sections: shipping?.sections || []
                });
                setPoliciesData({
                    effective_date: policies?.effective_date || "",
                    intro_text: policies?.intro_text || "",
                    privacy_sections: policies?.privacy_sections || [],
                    terms_sections: policies?.terms_sections || []
                });
            })
            .catch(error => console.error('Failed to load settings:', error))
            .finally(() => setIsLoading(false));
    }, []);

    // Save settings
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await Promise.all([
                settingsApi.saveSection('shipping', shippingData),
                settingsApi.saveSection('policies', policiesData)
            ]);
            setIsEditing(false);
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    const currentData = activeTab === 'shipping' ? shippingData : policiesData;
    const currentSections = activeTab === 'shipping'
        ? shippingData.sections
        : activeTab === 'privacy'
            ? policiesData.privacy_sections
            : policiesData.terms_sections;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    href="/admin/settings"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <FiChevronLeft size={20} />
                    Back to Settings
                </Link>

                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Policies</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Shipping, Terms & Conditions, and Privacy Policy
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

                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <div className="flex gap-8">
                        {[
                            { key: 'shipping' as const, label: 'Shipping Policy' },
                            { key: 'privacy' as const, label: 'Privacy Policy' },
                            { key: 'terms' as const, label: 'Terms & Conditions' }
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.key
                                    ? 'border-black text-black'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Form */}
                <div className="space-y-6">
                    {/* Effective Date */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Effective Date
                        </label>
                        <input
                            type="text"
                            value={currentData.effective_date}
                            onChange={(e) => {
                                if (activeTab === 'shipping') {
                                    setShippingData(prev => ({ ...prev, effective_date: e.target.value }));
                                } else {
                                    setPoliciesData(prev => ({ ...prev, effective_date: e.target.value }));
                                }
                            }}
                            placeholder="25/09/2025"
                            readOnly={!isEditing}
                            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        />
                    </div>

                    {/* Intro Text */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Introduction Text
                        </label>
                        <textarea
                            value={currentData.intro_text}
                            onChange={(e) => {
                                if (activeTab === 'shipping') {
                                    setShippingData(prev => ({ ...prev, intro_text: e.target.value }));
                                } else {
                                    setPoliciesData(prev => ({ ...prev, intro_text: e.target.value }));
                                }
                            }}
                            placeholder="Introduction paragraph..."
                            rows={3}
                            readOnly={!isEditing}
                            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        />
                    </div>

                    {/* Policy Sections */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 capitalize">{activeTab} Policy Sections</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    {isEditing ? "Modify sections and points below" : `Currently viewing ${currentSections.length} sections`}
                                </p>
                            </div>

                            {isEditing && (
                                <button
                                    onClick={() => {
                                        const newSection = { title: "New Section", points: ["First point"] };
                                        if (activeTab === 'shipping') {
                                            setShippingData(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
                                        } else if (activeTab === 'privacy') {
                                            setPoliciesData(prev => ({ ...prev, privacy_sections: [...prev.privacy_sections, newSection] }));
                                        } else {
                                            setPoliciesData(prev => ({ ...prev, terms_sections: [...prev.terms_sections, newSection] }));
                                        }
                                    }}
                                    className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-black transition-colors"
                                >
                                    + Add Section
                                </button>
                            )}
                        </div>

                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            {currentSections.map((section, sectionIndex) => (
                                <div key={sectionIndex} className="border border-gray-200 rounded-lg p-5 bg-gray-50/30 relative group">
                                    {isEditing && (
                                        <button
                                            onClick={() => {
                                                const newSections = currentSections.filter((_, i) => i !== sectionIndex);
                                                if (activeTab === 'shipping') setShippingData(prev => ({ ...prev, sections: newSections }));
                                                else if (activeTab === 'privacy') setPoliciesData(prev => ({ ...prev, privacy_sections: newSections }));
                                                else setPoliciesData(prev => ({ ...prev, terms_sections: newSections }));
                                            }}
                                            className="absolute top-4 right-4 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                                            title="Remove Section"
                                        >
                                            <FiX size={18} />
                                        </button>
                                    )}

                                    <div className="mb-4">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                            Section Title
                                        </label>
                                        <input
                                            type="text"
                                            value={section.title}
                                            onChange={(e) => {
                                                const newSections = [...currentSections];
                                                newSections[sectionIndex].title = e.target.value;

                                                if (activeTab === 'shipping') setShippingData(prev => ({ ...prev, sections: newSections }));
                                                else if (activeTab === 'privacy') setPoliciesData(prev => ({ ...prev, privacy_sections: newSections }));
                                                else setPoliciesData(prev => ({ ...prev, terms_sections: newSections }));
                                            }}
                                            placeholder="Section Title"
                                            readOnly={!isEditing}
                                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg font-medium focus:ring-1 focus:ring-black ${!isEditing ? 'bg-gray-50 cursor-not-allowed border-transparent' : 'bg-white'}`}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                            Policy Points
                                        </label>
                                        {section.points.map((point, pointIndex) => (
                                            <div key={pointIndex} className="relative group/point flex gap-2">
                                                <textarea
                                                    value={point}
                                                    onChange={(e) => {
                                                        const newSections = [...currentSections];
                                                        newSections[sectionIndex].points[pointIndex] = e.target.value;

                                                        if (activeTab === 'shipping') setShippingData(prev => ({ ...prev, sections: newSections }));
                                                        else if (activeTab === 'privacy') setPoliciesData(prev => ({ ...prev, privacy_sections: newSections }));
                                                        else setPoliciesData(prev => ({ ...prev, terms_sections: newSections }));
                                                    }}
                                                    placeholder="Policy point"
                                                    rows={2}
                                                    readOnly={!isEditing}
                                                    className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-black leading-relaxed ${!isEditing ? 'bg-gray-50 cursor-not-allowed border-transparent' : 'bg-white'}`}
                                                />
                                                {isEditing && (
                                                    <button
                                                        onClick={() => {
                                                            const newSections = [...currentSections];
                                                            newSections[sectionIndex].points = newSections[sectionIndex].points.filter((_, i) => i !== pointIndex);
                                                            if (activeTab === 'shipping') setShippingData(prev => ({ ...prev, sections: newSections }));
                                                            else if (activeTab === 'privacy') setPoliciesData(prev => ({ ...prev, privacy_sections: newSections }));
                                                            else setPoliciesData(prev => ({ ...prev, terms_sections: newSections }));
                                                        }}
                                                        className="mt-2 text-gray-400 hover:text-red-500 transition-colors p-1"
                                                        title="Remove Point"
                                                    >
                                                        <FiX size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}

                                        {isEditing && (
                                            <button
                                                onClick={() => {
                                                    const newSections = [...currentSections];
                                                    newSections[sectionIndex].points.push("");
                                                    if (activeTab === 'shipping') setShippingData(prev => ({ ...prev, sections: newSections }));
                                                    else if (activeTab === 'privacy') setPoliciesData(prev => ({ ...prev, privacy_sections: newSections }));
                                                    else setPoliciesData(prev => ({ ...prev, terms_sections: newSections }));
                                                }}
                                                className="text-sm text-gray-600 hover:text-black font-medium mt-1 inline-flex items-center gap-1"
                                            >
                                                + Add Point
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}
