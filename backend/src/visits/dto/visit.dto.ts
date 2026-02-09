import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateVisitDto {
    @IsString()
    @IsNotEmpty()
    patientId: string;

    @IsString()
    @IsNotEmpty()
    departmentId: string;

    @IsString()
    @IsOptional()
    reason?: string;
}

export class UpdateVitalsDto {
    @IsNumber()
    @Min(30)
    @Max(45)
    temperature: number;

    @IsNumber()
    @IsOptional()
    bpSystolic?: number;

    @IsNumber()
    @IsOptional()
    bpDiastolic?: number;

    @IsNumber()
    @Min(30)
    @Max(250)
    heartRate: number;

    @IsNumber()
    @IsOptional()
    respiratoryRate?: number;

    @IsNumber()
    @IsOptional()
    oxygenSaturation?: number;

    @IsNumber()
    @IsOptional()
    weight?: number;

    @IsNumber()
    @IsOptional()
    height?: number;
}

export class UpdateConsultationDto {
    @IsString()
    @IsNotEmpty()
    notes: string;

    @IsString()
    @IsOptional()
    prescription?: string;

    @IsString()
    @IsOptional()
    diagnosis?: string;
}
