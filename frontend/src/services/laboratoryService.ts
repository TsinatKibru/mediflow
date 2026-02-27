import { apiClient } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/api.config';

const BASE_URL = API_ENDPOINTS.LAB.BASE;

export interface LabOrder {
    id: string;
    testName: string;
    instructions?: string;
    status: 'ORDERED' | 'COLLECTED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
    result?: string;
    visitId: string;
    prescribedById: string;
    prescribedBy: {
        firstName: string;
        lastName: string;
    };
    visit: {
        patient: {
            id: string;
            firstName: string;
            lastName: string;
        };
    };
    createdAt: string;
    updatedAt: string;
    payments?: {
        id: string;
        amountCharged: number;
        amountPaid: number;
        status: 'PENDING' | 'COMPLETED' | 'FAILED';
    }[];
}

export const laboratoryService = {
    getOrders: async (status?: string) => {
        return apiClient.get(`${BASE_URL}${status ? `?status=${status}` : ''}`);
    },

    updateOrder: async (id: string, data: { status?: string, result?: string }) => {
        return apiClient.patch(`${BASE_URL}/${id}`, data);
    }
};
