import { apiClient } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/api.config';

export const userService = {
    getUsers: async () => {
        return apiClient.get(API_ENDPOINTS.USERS.BASE);
    },

    getUser: async (id: string) => {
        return apiClient.get(API_ENDPOINTS.USERS.BY_ID(id));
    },

    createUser: async (data: any) => {
        return apiClient.post(API_ENDPOINTS.USERS.BASE, data);
    },

    updateUser: async (id: string, data: any) => {
        return apiClient.patch(API_ENDPOINTS.USERS.BY_ID(id), data);
    },

    removeUser: async (id: string) => {
        return apiClient.delete(API_ENDPOINTS.USERS.BY_ID(id));
    }
};
