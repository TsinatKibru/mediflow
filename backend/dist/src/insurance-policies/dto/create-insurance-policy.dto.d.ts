import { CoverageType } from '@prisma/client';
export declare class CreateInsurancePolicyDto {
    type: CoverageType;
    policyNumber: string;
    issuedToName?: string;
    issueYear?: number;
    expiryYear?: number;
    providerName?: string;
    notes?: string;
    patientId: string;
}
