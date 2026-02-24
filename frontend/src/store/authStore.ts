import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

interface Tenant {
    id: string;
    name: string;
    subdomain: string;
    primaryColor?: string;
}

interface AuthState {
    user: User | null;
    tenant: Tenant | null;
    token: string | null;
    isHydrated: boolean;
    setAuth: (user: User, tenant: Tenant, token: string) => void;
    setUser: (user: User) => void;
    setTenant: (tenant: Tenant) => void;
    logout: () => void;
    setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            tenant: null,
            token: null,
            isHydrated: false,
            setAuth: (user, tenant, token) => set({ user, tenant, token }),
            setUser: (user) => set({ user }),
            setTenant: (tenant) => set({ tenant }),
            logout: () => set({ user: null, tenant: null, token: null }),
            setHydrated: () => set({ isHydrated: true }),
        }),
        {
            name: 'mediflow-auth',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHydrated();
            },
        }
    )
);
