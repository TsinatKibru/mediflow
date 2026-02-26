const BASE_URL = 'http://localhost:3000';

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
}

export const pharmacyService = {
    // Medications
    getMedications: async (token: string, search?: string) => {
        const res = await fetch(`${BASE_URL}/medications${search ? `?search=${search}` : ''}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.json();
    },

    getMedication: async (token: string, id: string) => {
        const res = await fetch(`${BASE_URL}/medications/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.json();
    },

    createMedication: async (token: string, data: Partial<Medication>) => {
        const res = await fetch(`${BASE_URL}/medications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        return res.json();
    },

    updateMedication: async (token: string, id: string, data: Partial<Medication>) => {
        const res = await fetch(`${BASE_URL}/medications/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        return res.json();
    },

    // Pharmacy Orders
    getOrders: async (token: string, status?: string) => {
        const res = await fetch(`${BASE_URL}/pharmacy-orders${status ? `?status=${status}` : ''}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.json();
    },

    getOrdersByVisit: async (token: string, visitId: string) => {
        const res = await fetch(`${BASE_URL}/pharmacy-orders/visit/${visitId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.json();
    },

    createOrder: async (token: string, data: { medicationId: string, visitId: string, quantity: number, instructions?: string }) => {
        const res = await fetch(`${BASE_URL}/pharmacy-orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to create order');
        }
        return res.json();
    },

    updateOrderStatus: async (token: string, id: string, status: string) => {
        const res = await fetch(`${BASE_URL}/pharmacy-orders/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });
        return res.json();
    },
};
