import { AuthService } from './auth.service';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerTenant(registerTenantDto: RegisterTenantDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.Role;
            departmentId: string | null;
        };
        tenant: {
            id: string;
            name: string;
            subdomain: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.Role;
            departmentId: string | null;
        };
        tenant: {
            id: string;
            name: string;
            subdomain: string;
        };
    }>;
    getProfile(req: any): Promise<any>;
    updateProfile(req: any, dto: UpdateProfileDto): Promise<{
        id: string;
        tenantId: string;
        firstName: string;
        lastName: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        departmentId: string | null;
    }>;
}
