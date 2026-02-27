import { apiClient } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/api.config';

export interface Department {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
}

export const departmentService = {
    getDepartments: async () => {
        return apiClient.get(API_ENDPOINTS.DEPARTMENTS.BASE);
    },

    getDepartment: async (id: string) => {
        return apiClient.get(`${API_ENDPOINTS.DEPARTMENTS.BASE}/${id}`);
    },

    createDepartment: async (data: Partial<Department>) => {
        return apiClient.post(API_ENDPOINTS.DEPARTMENTS.BASE, data);
    },

    updateDepartment: async (id: string, data: Partial<Department>) => {
        return apiClient.patch(`${API_ENDPOINTS.DEPARTMENTS.BASE}/${id}`, data);
    }
};
