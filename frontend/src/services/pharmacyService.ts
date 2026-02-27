import { apiClient } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/api.config';

const BASE_URL = API_ENDPOINTS.BILLING.SERVICE_CATALOG.replace('/service-catalog', ''); // Get base from endpoints

export interface Medication {
    id: string;
    name: string;
    genericName?: string;
    dosageForm: string;
    strength: string;
    stockBalance: number;
    unitPrice: number;
}

export interface PharmacyOrder {
    id: string;
    medicationId: string;
    medication: Medication;
    quantity: number;
    instructions?: string;
    status: 'PENDING' | 'DISPENSED' | 'CANCELLED';
    visitId: string;
    createdAt: string;
    prescribedBy: any;
    dispensedBy?: any;
    visit?: any;
    payments?: {
        id: string;
        amountCharged: number;
        amountPaid: number;
        status: 'PENDING' | 'COMPLETED' | 'FAILED';
    }[];
}

export const pharmacyService = {
    // Medications
    getMedications: async (token: string, search?: string) => {
        return apiClient.get(`${BASE_URL}/medications${search ? `?search=${search}` : ''}`);
    },

    getMedication: async (token: string, id: string) => {
        return apiClient.get(`${BASE_URL}/medications/${id}`);
    },

    createMedication: async (token: string, data: Partial<Medication>) => {
        return apiClient.post(`${BASE_URL}/medications`, data);
    },

    updateMedication: async (token: string, id: string, data: Partial<Medication>) => {
        return apiClient.patch(`${BASE_URL}/medications/${id}`, data);
    },

    // Pharmacy Orders
    getOrders: async (token: string, status?: string) => {
        return apiClient.get(`${BASE_URL}/pharmacy-orders${status ? `?status=${status}` : ''}`);
    },

    getOrdersByVisit: async (token: string, visitId: string) => {
        return apiClient.get(`${BASE_URL}/pharmacy-orders/visit/${visitId}`);
    },

    createOrder: async (token: string, data: { medicationId: string, visitId: string, quantity: number, instructions?: string }) => {
        return apiClient.post(`${BASE_URL}/pharmacy-orders`, data);
    },

    updateOrderStatus: async (token: string, id: string, status: string) => {
        return apiClient.patch(`${BASE_URL}/pharmacy-orders/${id}/status`, { status });
    },
};
