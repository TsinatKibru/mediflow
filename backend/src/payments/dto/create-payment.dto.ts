import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum CoverageType {
    SELF = 'SELF',
    GOVERNMENT_BOOK = 'GOVERNMENT_BOOK',
    NGO = 'NGO',
    OTHER = 'OTHER',
}

export enum PaymentMethod {
    CASH = 'CASH',
    WAIVED = 'WAIVED',
    PARTIAL = 'PARTIAL',
    OTHER = 'OTHER',
}

export enum ServiceType {
    REGISTRATION = 'REGISTRATION',
    CONSULTATION = 'CONSULTATION',
    LABORATORY = 'LABORATORY',
    PHARMACY = 'PHARMACY',
    PROCEDURE = 'PROCEDURE',
    RADIOLOGY = 'RADIOLOGY',
    OTHER = 'OTHER',
}

class CoverageDto {
    @IsEnum(CoverageType)
    type: CoverageType;

    @IsOptional()
    @IsString()
    referenceNumber?: string;

    @IsOptional()
    @IsString()
    issuedToName?: string;

    @IsOptional()
    @IsNumber()
    issueYear?: number;

    @IsOptional()
    @IsNumber()
    expiryYear?: number;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsUUID()
    insurancePolicyId?: string;
}

export class CreatePaymentDto {
    @IsUUID()
    visitId: string;

    @IsNumber()
    amountCharged: number;

    @IsNumber()
    amountPaid: number;

    @IsEnum(PaymentMethod)
    method: PaymentMethod;

    @IsEnum(ServiceType)
    serviceType: ServiceType;

    @IsOptional()
    @IsString()
    reason?: string;

    @IsOptional()
    @IsUUID()
    insurancePolicyId?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => CoverageDto)
    coverage?: CoverageDto;
}
