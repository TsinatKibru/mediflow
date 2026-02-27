import { apiClient } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/api.config';

export interface Visit {
    id: string;
    visitType: string;
    status: string;
    patientId: string;
    patient: {
        firstName: string;
        lastName: string;
        gender: string;
        dateOfBirth: string;
    };
    departmentId: string;
    department: {
        name: string;
    };
    doctorSelection: 'ANY' | 'SPECIFIC';
    doctorId?: string;
    doctor?: {
        firstName: string;
        lastName: string;
    };
    reasonForVisit: string;
    priority: 'NORMAL' | 'URGENT' | 'EMERGENCY';
    createdAt: string;
}

export const visitService = {
    getVisits: async (options: {
        status?: string;
        departmentId?: string;
        paymentStatus?: string;
        search?: string;
        skip?: number;
        take?: number;
    } = {}) => {
        const { status, departmentId, paymentStatus, search, skip = 0, take = 10 } = options;
        const params = new URLSearchParams({
            skip: skip.toString(),
            take: take.toString(),
        });

        if (status) params.append('status', status);
        if (departmentId) params.append('departmentId', departmentId);
        if (paymentStatus) params.append('paymentStatus', paymentStatus);
        if (search) params.append('search', search);

        return apiClient.get(`${API_ENDPOINTS.VISITS.BASE}?${params.toString()}`);
    },

    getVisit: async (id: string) => {
        return apiClient.get(API_ENDPOINTS.VISITS.BY_ID(id));
    },

    getPatientVisits: async (patientId: string) => {
        return apiClient.get(API_ENDPOINTS.VISITS.PATIENT(patientId));
    },

    updateTriage: async (id: string, data: any) => {
        return apiClient.post(API_ENDPOINTS.VISITS.TRIAGE(id), data);
    },

    updateConsultation: async (id: string, data: any) => {
        return apiClient.post(API_ENDPOINTS.VISITS.CONSULTATION(id), data);
    },

    createVisit: async (data: any) => {
        return apiClient.post(API_ENDPOINTS.VISITS.BASE, data);
    }
};
