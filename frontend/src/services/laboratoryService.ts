import { API_BASE_URL } from '@/config/api.config';
const BASE_URL = API_BASE_URL;

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
    getOrders: async (token: string, status?: string) => {
        const res = await fetch(`${BASE_URL}/lab-orders${status ? `?status=${status}` : ''}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.json();
    },

    updateOrder: async (token: string, id: string, data: { status?: string, result?: string }) => {
        const res = await fetch(`${BASE_URL}/lab-orders/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        return res.json();
    }
};
