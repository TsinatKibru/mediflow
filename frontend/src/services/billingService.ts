import { apiClient } from '@/lib/apiClient';
import { API_ENDPOINTS, API_BASE_URL } from '@/config/api.config';

export interface ServiceItem {
    id: string;
    category: string;
    name: string;
    code: string;
    description?: string;
    price: number;
    isActive: boolean;
}

export const billingService = {
    // Service Catalog
    getServices: async (category?: string) => {
        const url = category && category !== 'ALL'
            ? `${API_ENDPOINTS.BILLING.SERVICE_CATALOG}?category=${category}`
            : API_ENDPOINTS.BILLING.SERVICE_CATALOG;
        return apiClient.get(url);
    },

    createService: async (data: Partial<ServiceItem>) => {
        return apiClient.post(API_ENDPOINTS.BILLING.SERVICE_CATALOG, data);
    },

    updateService: async (id: string, data: Partial<ServiceItem>) => {
        return apiClient.patch(`${API_ENDPOINTS.BILLING.SERVICE_CATALOG}/${id}`, data);
    },

    deleteService: async (id: string) => {
        return apiClient.delete(`${API_ENDPOINTS.BILLING.SERVICE_CATALOG}/${id}`);
    },

    // Payments & Billing
    getBills: async (status?: string) => {
        return apiClient.get(`${API_BASE_URL}/bills${status ? `?status=${status}` : ''}`);
    },

    createBill: async (data: any) => {
        return apiClient.post(`${API_BASE_URL}/bills`, data);
    },

    processPayment: async (billId: string, data: any) => {
        return apiClient.post(`${API_ENDPOINTS.BILLING.PAYMENTS}/${billId}`, data);
    }
};
