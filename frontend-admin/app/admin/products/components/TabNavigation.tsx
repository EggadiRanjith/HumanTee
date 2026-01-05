/**
 * Tab Navigation Component
 * Tabbed interface for organizing product form sections
 */

'use client';

import { TabKey, TabConfig } from '@/types/product-form.types';

interface TabNavigationProps {
    activeTab: TabKey;
    onTabChange: (tab: TabKey) => void;
    tabs: TabConfig[];
}

export default function TabNavigation({ activeTab, onTabChange, tabs }: TabNavigationProps) {
    return (
        <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="flex overflow-x-auto scrollbar-hide">
                {(tabs || []).map((tab) => (
                    <div
                        key={tab.key}
                        className={`
              relative px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium whitespace-nowrap
              transition-colors duration-200 cursor-default
              ${activeTab === tab.key
                                ? 'text-black border-b-2 border-black'
                                : 'text-gray-400'
                            }
            `}
                    >
                        <div className="flex items-center gap-2">
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                            {tab.hasErrors && (
                                <span className="w-2 h-2 bg-red-500 rounded-full" title="Has errors" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
