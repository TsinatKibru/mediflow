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
    getMedications: async (search?: string) => {
        return apiClient.get(`${API_ENDPOINTS.PHARMACY.MEDICATIONS}${search ? `?search=${search}` : ''}`);
    },

    getMedication: async (id: string) => {
        return apiClient.get(`${API_ENDPOINTS.PHARMACY.MEDICATIONS}/${id}`);
    },

    createMedication: async (data: Partial<Medication>) => {
        const sanitizedData = {
            name: data.name,
            genericName: data.genericName,
            dosageForm: data.dosageForm,
            strength: data.strength,
            stockBalance: Number(data.stockBalance),
            unitPrice: Number(data.unitPrice)
        };
        return apiClient.post(API_ENDPOINTS.PHARMACY.MEDICATIONS, sanitizedData);
    },

    updateMedication: async (id: string, data: Partial<Medication>) => {
        const sanitizedData = {
            name: data.name,
            genericName: data.genericName,
            dosageForm: data.dosageForm,
            strength: data.strength,
            stockBalance: data.stockBalance !== undefined ? Number(data.stockBalance) : undefined,
            unitPrice: data.unitPrice !== undefined ? Number(data.unitPrice) : undefined
        };
        return apiClient.patch(`${API_ENDPOINTS.PHARMACY.MEDICATIONS}/${id}`, sanitizedData);
    },

    // Pharmacy Orders
    getOrders: async (status?: string) => {
        return apiClient.get(`${API_ENDPOINTS.PHARMACY.ORDERS}${status ? `?status=${status}` : ''}`);
    },

    getOrdersByVisit: async (visitId: string) => {
        return apiClient.get(API_ENDPOINTS.PHARMACY.BY_VISIT(visitId));
    },

    createOrder: async (data: { medicationId: string, visitId: string, quantity: number, instructions?: string }) => {
        return apiClient.post(API_ENDPOINTS.PHARMACY.ORDERS, data);
    },

    updateOrderStatus: async (id: string, status: string) => {
        return apiClient.patch(API_ENDPOINTS.PHARMACY.ORDER_STATUS(id), { status });
    },
};
