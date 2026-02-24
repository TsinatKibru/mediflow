import { TenantsService } from './tenants.service';
import { UpdateTenantDto } from './dto/update-tenant.dto';
export declare class TenantsController {
    private readonly tenantsService;
    constructor(tenantsService: TenantsService);
    getCurrentTenant(req: any): Promise<{
        id: string;
        subdomain: string;
        name: string;
        logoUrl: string | null;
        primaryColor: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    updateTenant(req: any, dto: UpdateTenantDto): Promise<{
        id: string;
        subdomain: string;
        name: string;
        logoUrl: string | null;
        primaryColor: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
