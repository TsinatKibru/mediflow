import { IsString, IsEnum, IsOptional, IsInt, IsBoolean } from 'class-validator';
import { CoverageType } from '@prisma/client';

export class CreateInsurancePolicyDto {
    @IsEnum(CoverageType)
    type: CoverageType;

    @IsString()
    policyNumber: string;

    @IsString()
    @IsOptional()
    issuedToName?: string;

    @IsInt()
    @IsOptional()
    issueYear?: number;

    @IsInt()
    @IsOptional()
    expiryYear?: number;

    @IsString()
    @IsOptional()
    providerName?: string;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsString()
    patientId: string;
}
