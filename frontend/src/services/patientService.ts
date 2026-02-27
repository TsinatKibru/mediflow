import { apiClient } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/api.config';

export interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'MALE' | 'FEMALE';
    phone: string;
    email: string;
    createdAt: string;
}

export const patientService = {
    getPatients: async (search?: string, page: number = 1, limit: number = 10) => {
        let url = `${API_ENDPOINTS.PATIENTS.BASE}?page=${page}&limit=${limit}`;
        if (search) url += `&search=${search}`;
        return apiClient.get(url);
    },

    getPatient: async (id: string) => {
        return apiClient.get(API_ENDPOINTS.PATIENTS.BY_ID(id));
    },

    createPatient: async (data: Partial<Patient>) => {
        return apiClient.post(API_ENDPOINTS.PATIENTS.BASE, data);
    },

    updatePatient: async (id: string, data: Partial<Patient>) => {
        return apiClient.patch(API_ENDPOINTS.PATIENTS.BY_ID(id), data);
    },

    getPatientVisits: async (id: string) => {
        return apiClient.get(API_ENDPOINTS.PATIENTS.VISITS(id));
    }
};
