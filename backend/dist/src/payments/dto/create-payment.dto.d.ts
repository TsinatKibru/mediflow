export declare enum CoverageType {
    SELF = "SELF",
    GOVERNMENT_BOOK = "GOVERNMENT_BOOK",
    NGO = "NGO",
    OTHER = "OTHER"
}
export declare enum PaymentMethod {
    CASH = "CASH",
    WAIVED = "WAIVED",
    PARTIAL = "PARTIAL",
    OTHER = "OTHER"
}
export declare enum ServiceType {
    REGISTRATION = "REGISTRATION",
    CONSULTATION = "CONSULTATION",
    LABORATORY = "LABORATORY",
    PHARMACY = "PHARMACY",
    PROCEDURE = "PROCEDURE",
    RADIOLOGY = "RADIOLOGY",
    OTHER = "OTHER"
}
declare class CoverageDto {
    type: CoverageType;
    referenceNumber?: string;
    issuedToName?: string;
    issueYear?: number;
    expiryYear?: number;
    notes?: string;
    insurancePolicyId?: string;
}
export declare class CreatePaymentDto {
    visitId: string;
    amountCharged: number;
    amountPaid: number;
    method: PaymentMethod;
    serviceType: ServiceType;
    reason?: string;
    insurancePolicyId?: string;
    coverage?: CoverageDto;
}
export {};
