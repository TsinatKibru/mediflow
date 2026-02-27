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
    getVisits: async (status?: string, departmentId?: string) => {
        let url = API_ENDPOINTS.VISITS.BASE + '?';
        if (status) url += `status=${status}&`;
        if (departmentId) url += `departmentId=${departmentId}&`;
        return apiClient.get(url);
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
