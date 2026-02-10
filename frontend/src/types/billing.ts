export interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    phone: string;
    email: string;
    address?: string;
    createdAt: string;
}

export interface InsurancePolicy {
    id: string;
    type: 'SELF' | 'GOVERNMENT_BOOK' | 'NGO' | 'OTHER';
    policyNumber: string;
    issuedToName?: string;
    issueYear?: number;
    expiryYear?: number;
    providerName?: string;
    notes?: string;
    isActive: boolean;
    createdAt: string;
}

export interface Payment {
    id: string;
    amountCharged: number | string;
    amountPaid: number | string;
    method: 'CASH' | 'WAIVED' | 'PARTIAL' | 'OTHER';
    serviceType: 'REGISTRATION' | 'CONSULTATION' | 'LABORATORY' | 'PHARMACY' | 'PROCEDURE' | 'RADIOLOGY' | 'OTHER';
    status: string;
    reason?: string;
    createdAt: string;
    verifiedBy?: {
        firstName: string;
        lastName: string;
    };
}

export interface Coverage {
    id: string;
    type: 'SELF' | 'GOVERNMENT_BOOK' | 'NGO' | 'OTHER';
    referenceNumber?: string;
    issuedToName?: string;
    issueYear?: number;
    expiryYear?: number;
    insurancePolicyId?: string;
    notes?: string;
    verifiedBy?: {
        firstName: string;
        lastName: string;
    };
    verifiedAt: string;
}

export interface Visit {
    id: string;
    status: 'REGISTERED' | 'WAITING' | 'IN_CONSULTATION' | 'COMPLETED' | 'NO_SHOW' | 'CANCELLED';
    reason: string;
    createdAt: string;
    department: {
        name: string;
    };
    vitals?: any;
    consultation?: {
        notes: string;
        prescription?: string;
    };
    payments?: Payment[];
    coverage?: Coverage;
    patient?: Patient;
}
