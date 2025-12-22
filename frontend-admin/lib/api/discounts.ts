import apiClient from '../api-client';

export interface DiscountTargetGroup {
    groupType: 'COLLECTION' | 'TYPE' | 'CATEGORY';
    groupValue: string;
}

export interface CreateDiscountDto {
    name: string;
    code: string;
    type: 'PERCENT' | 'FLAT';
    value: number;
    scope: 'GLOBAL' | 'PRODUCT' | 'GROUP';
    audience: 'ALL' | 'NEW' | 'FREQUENT' | 'TOP';
    minOrderAmount: number;
    globalUsageLimit: number | null;
    perUserLimit: number;
    priority: number;
    isStackable: boolean;
    startDate: string;
    endDate: string | null;
    isActive: boolean;
    targetGroups?: { groupType: string; groupValue: string }[];
}

export const discountsApi = {
    getAll: async () => {
        const response = await apiClient.get('/admin/discounts');
        return response.data;
    },

    getOne: async (id: string) => {
        const response = await apiClient.get(`/admin/discounts/${id}`);
        return response.data;
    },

    create: async (data: any) => {
        const response = await apiClient.post('/admin/discounts', data);
        return response.data;
    },

    update: async (id: string, data: any) => {
        const response = await apiClient.put(`/admin/discounts/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/admin/discounts/${id}`);
        return response.data;
    },

    validate: async (code: string) => {
        const response = await apiClient.get(`/admin/discounts/validate/${code}`);
        return response.data;
    }
};
