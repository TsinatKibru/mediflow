import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

interface RequestOptions extends RequestInit {
    body?: any;
}

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        if (response.status === 401) {
            // Optional: Handle token expiration globally
            // useAuthStore.getState().logout();
        }
        const error = await response.json().catch(() => ({ message: 'An unexpected error occurred' }));
        throw new Error(error.message || `Error: ${response.status}`);
    }
    return response.json();
};

export const apiClient = {
    async get(url: string) {
        const { token } = useAuthStore.getState();
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return handleResponse(response);
    },

    async post(url: string, body: any) {
        const { token } = useAuthStore.getState();
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });
        return handleResponse(response);
    },

    async patch(url: string, body: any) {
        const { token } = useAuthStore.getState();
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });
        return handleResponse(response);
    },

    async delete(url: string) {
        const { token } = useAuthStore.getState();
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return handleResponse(response);
    }
};
