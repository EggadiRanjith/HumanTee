/**
 * Team Management Page (PRODUCTION-GRADE)
 * Manage admin users and roles (RBAC)
 * CRITICAL: This is the RBAC management UI
 */

'use client';

import { useState } from 'react';

// Mock data - replace with API call
const mockAdmins = [
    {
        id: '1',
        name: 'Admin User',
        email: 'admin@humantee.com',
        role: 'OWNER',
        createdAt: new Date('2024-01-01'),
        lastLogin: new Date('2024-12-20T10:30:00'),
    },
    {
        id: '2',
        name: 'Manager User',
        email: 'manager@humantee.com',
        role: 'MANAGER',
        createdAt: new Date('2024-02-15'),
        lastLogin: new Date('2024-12-19T15:20:00'),
    },
    {
        id: '3',
        name: 'Support User',
        email: 'support@humantee.com',
        role: 'SUPPORT',
        createdAt: new Date('2024-03-10'),
        lastLogin: new Date('2024-12-18T09:45:00'),
    },
];

const PERMISSION_MATRIX = {
    OWNER: {
        products: ['create', 'read', 'update', 'delete', 'publish'],
        orders: ['read', 'update', 'cancel', 'refund'],
        customers: ['read', 'update', 'delete'],
        settings: ['read', 'update'],
        analytics: ['read'],
        audit_logs: ['read'],
        admin: ['create', 'read', 'update', 'delete'],
    },
    MANAGER: {
        products: ['create', 'read', 'update', 'publish'],
        orders: ['read', 'update'],
        customers: ['read'],
        analytics: ['read'],
    },
    SUPPORT: {
        products: ['read'],
        orders: ['read', 'update'],
        customers: ['read'],
    },
    VIEWER: {
        products: ['read'],
        orders: ['read'],
        customers: ['read'],
        analytics: ['read'],
    },
};

export default function TeamManagementPage() {
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [editingAdmin, setEditingAdmin] = useState<string | null>(null);
    const [newRole, setNewRole] = useState('');

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'OWNER':
                return 'bg-purple-100 text-purple-700';
            case 'MANAGER':
                return 'bg-blue-100 text-blue-700';
            case 'SUPPORT':
                return 'bg-green-100 text-green-700';
            case 'VIEWER':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const handleRoleChange = (adminId: string) => {
        // TODO: API call to update role
        console.log(`Updating admin ${adminId} to role ${newRole}`);
        setEditingAdmin(null);
        setNewRole('');
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-black">Team Management</h1>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Manage admin users and roles
                    </p>
                </div>
                <button className="bg-black hover:bg-gray-900 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm">
                    + Invite Admin
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Total Admins</div>
                    <div className="text-lg sm:text-2xl font-semibold text-black">{mockAdmins.length}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Owners</div>
                    <div className="text-lg sm:text-2xl font-semibold text-black">
                        {mockAdmins.filter((a) => a.role === 'OWNER').length}
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Managers</div>
                    <div className="text-lg sm:text-2xl font-semibold text-black">
                        {mockAdmins.filter((a) => a.role === 'MANAGER').length}
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Support</div>
                    <div className="text-lg sm:text-2xl font-semibold text-black">
                        {mockAdmins.filter((a) => a.role === 'SUPPORT').length}
                    </div>
                </div>
            </div>

            {/* Admin List (Desktop) */}
            <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Admin
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Role
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Last Login
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {mockAdmins.map((admin) => (
                            <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-black">{admin.name}</div>
                                    <div className="text-xs text-gray-500">{admin.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    {editingAdmin === admin.id ? (
                                        <select
                                            value={newRole || admin.role}
                                            onChange={(e) => setNewRole(e.target.value)}
                                            className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                                        >
                                            <option value="OWNER">Owner</option>
                                            <option value="MANAGER">Manager</option>
                                            <option value="SUPPORT">Support</option>
                                            <option value="VIEWER">Viewer</option>
                                        </select>
                                    ) : (
                                        <span
                                            className={`px-2 py-1 text-xs font-medium rounded ${getRoleBadgeColor(
                                                admin.role
                                            )}`}
                                        >
                                            {admin.role}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {admin.lastLogin.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    {editingAdmin === admin.id ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleRoleChange(admin.id)}
                                                className="text-sm text-green-600 hover:underline font-medium"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingAdmin(null);
                                                    setNewRole('');
                                                }}
                                                className="text-sm text-gray-600 hover:underline"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setEditingAdmin(admin.id)}
                                                className="text-sm text-black hover:underline font-medium"
                                            >
                                                Change Role
                                            </button>
                                            <button
                                                onClick={() => setSelectedRole(admin.role)}
                                                className="text-sm text-gray-600 hover:underline"
                                            >
                                                View Permissions
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Admin Cards (Mobile) */}
            <div className="lg:hidden space-y-3">
                {mockAdmins.map((admin) => (
                    <div key={admin.id} className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <div className="text-sm font-medium text-black">{admin.name}</div>
                                <div className="text-xs text-gray-500 mt-1">{admin.email}</div>
                            </div>
                            <span
                                className={`px-2 py-1 text-xs font-medium rounded ${getRoleBadgeColor(
                                    admin.role
                                )}`}
                            >
                                {admin.role}
                            </span>
                        </div>
                        <div className="text-xs text-gray-600 mb-3">
                            Last login: {admin.lastLogin.toLocaleString()}
                        </div>
                        <div className="flex gap-2">
                            <button className="text-sm text-black hover:underline font-medium">
                                Change Role
                            </button>
                            <button
                                onClick={() => setSelectedRole(admin.role)}
                                className="text-sm text-gray-600 hover:underline"
                            >
                                View Permissions
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Permission Matrix Modal */}
            {selectedRole && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-black">
                                    {selectedRole} Permissions
                                </h2>
                                <button
                                    onClick={() => setSelectedRole(null)}
                                    className="text-gray-500 hover:text-black"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            {Object.entries(PERMISSION_MATRIX[selectedRole as keyof typeof PERMISSION_MATRIX] || {}).map(
                                ([resource, actions]) => (
                                    <div key={resource} className="border border-gray-200 rounded-lg p-4">
                                        <div className="font-medium text-black mb-2 capitalize">
                                            {resource.replace('_', ' ')}
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {(actions as string[]).map((action) => (
                                                <span
                                                    key={action}
                                                    className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded"
                                                >
                                                    {action}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
