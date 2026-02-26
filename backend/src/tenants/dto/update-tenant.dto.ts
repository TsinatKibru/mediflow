import { IsOptional, IsString } from 'class-validator';

export class UpdateTenantDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    primaryColor?: string;

    @IsString()
    @IsOptional()
    currency?: string;

    @IsString()
    @IsOptional()
    currencySymbol?: string;
}
