import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateMedicationDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    genericName?: string;

    @IsString()
    @IsNotEmpty()
    dosageForm: string;

    @IsString()
    @IsNotEmpty()
    strength: string;

    @IsNumber()
    @Min(0)
    stockBalance: number;

    @IsNumber()
    @Min(0)
    unitPrice: number;
}

export class UpdateMedicationDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    genericName?: string;

    @IsString()
    @IsOptional()
    dosageForm?: string;

    @IsString()
    @IsOptional()
    strength?: string;

    @IsNumber()
    @IsOptional()
    @Min(0)
    stockBalance?: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    unitPrice?: number;
}
