export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/auth/login`,
        REGISTER_TENANT: `${API_BASE_URL}/auth/register-tenant`,
    },
    PATIENTS: {
        BASE: `${API_BASE_URL}/patients`,
        BY_ID: (id: string) => `${API_BASE_URL}/patients/${id}`,
        VISITS: (id: string) => `${API_BASE_URL}/patients/${id}/visits`,
    },
    VISITS: {
        BASE: `${API_BASE_URL}/visits`,
        BY_ID: (id: string) => `${API_BASE_URL}/visits/${id}`,
        PATIENT: (id: string) => `${API_BASE_URL}/visits/patient/${id}`,
        TRIAGE: (id: string) => `${API_BASE_URL}/visits/${id}/triage`,
        CONSULTATION: (id: string) => `${API_BASE_URL}/visits/${id}/consultation`,
    },
    DEPARTMENTS: {
        BASE: `${API_BASE_URL}/departments`,
    },
    APPOINTMENTS: {
        BASE: `${API_BASE_URL}/appointments`,
        BY_ID: (id: string) => `${API_BASE_URL}/appointments/${id}`,
        CHECK_IN: (id: string) => `${API_BASE_URL}/appointments/${id}/check-in`,
        DOCTORS: `${API_BASE_URL}/appointments/doctors`,
    },
    SCHEDULE: {
        BY_DOCTOR: (id: string) => `${API_BASE_URL}/schedule/${id}`,
    },
    BILLING: {
        PAYMENTS: `${API_BASE_URL}/payments`,
        SERVICE_CATALOG: `${API_BASE_URL}/service-catalog`,
        INSURANCE_POLICIES: `${API_BASE_URL}/insurance-policies`,
        INSURANCE_BY_PATIENT: (id: string) => `${API_BASE_URL}/insurance-policies/patient/${id}`,
    },
    LAB: {
        BASE: `${API_BASE_URL}/lab-orders`,
        BY_VISIT: (id: string) => `${API_BASE_URL}/lab-orders/visit/${id}`,
        BY_ID: (id: string) => `${API_BASE_URL}/lab-orders/${id}`,
    },
    TENANTS: {
        CURRENT: `${API_BASE_URL}/tenants/current`,
    },
    PHARMACY: {
        MEDICATIONS: `${API_BASE_URL}/medications`,
        ORDERS: `${API_BASE_URL}/pharmacy-orders`,
        ORDER_STATUS: (id: string) => `${API_BASE_URL}/pharmacy-orders/${id}/status`,
        BY_VISIT: (visitId: string) => `${API_BASE_URL}/pharmacy-orders/visit/${visitId}`,
    }
};
