import { PrismaService } from '../prisma/prisma.service';
import { UpdateTenantDto } from './dto/update-tenant.dto';
export declare class TenantsService {
    private prisma;
    constructor(prisma: PrismaService);
    getCurrentTenant(tenantId: string): Promise<{
        id: string;
        subdomain: string;
        name: string;
        logoUrl: string | null;
        primaryColor: string | null;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        currencySymbol: string;
    } | null>;
    updateTenant(tenantId: string, dto: UpdateTenantDto): Promise<{
        id: string;
        subdomain: string;
        name: string;
        logoUrl: string | null;
        primaryColor: string | null;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        currencySymbol: string;
    }>;
}
