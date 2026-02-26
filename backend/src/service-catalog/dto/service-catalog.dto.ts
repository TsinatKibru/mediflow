import { IsEnum, IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ServiceType } from '@prisma/client';

export class CreateServiceCatalogDto {
    @IsEnum(ServiceType)
    category: ServiceType;

    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    code?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    price: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateServiceCatalogDto {
    @IsOptional()
    @IsEnum(ServiceType)
    category?: ServiceType;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    code?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
