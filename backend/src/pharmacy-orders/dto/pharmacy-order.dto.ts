import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePharmacyOrderDto {
    @IsString()
    @IsNotEmpty()
    medicationId: string;

    @IsString()
    @IsNotEmpty()
    visitId: string;

    @IsNumber()
    @Min(0.1)
    quantity: number;

    @IsString()
    @IsOptional()
    instructions?: string;
}

export class UpdatePharmacyOrderStatusDto {
    @IsString()
    @IsNotEmpty()
    status: string; // PENDING, DISPENSED, CANCELLED
}
