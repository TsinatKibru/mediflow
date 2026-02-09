import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterTenantDto {
    @IsString()
    @IsNotEmpty()
    tenantName: string;

    @IsString()
    @IsNotEmpty()
    tenantSlug: string;

    @IsEmail()
    adminEmail: string;

    @IsString()
    @MinLength(8)
    adminPassword: string;
}
