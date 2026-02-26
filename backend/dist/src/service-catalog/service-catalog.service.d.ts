import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceCatalogDto, UpdateServiceCatalogDto } from './dto/service-catalog.dto';
export declare class ServiceCatalogService {
    private prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, dto: CreateServiceCatalogDto): Promise<{
        id: string;
        category: import(".prisma/client").$Enums.ServiceType;
        name: string;
        code: string | null;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    }>;
    findAll(tenantId: string, category?: string): Promise<{
        id: string;
        category: import(".prisma/client").$Enums.ServiceType;
        name: string;
        code: string | null;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    }[]>;
    findOne(tenantId: string, id: string): Promise<{
        id: string;
        category: import(".prisma/client").$Enums.ServiceType;
        name: string;
        code: string | null;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    }>;
    update(tenantId: string, id: string, dto: UpdateServiceCatalogDto): Promise<{
        id: string;
        category: import(".prisma/client").$Enums.ServiceType;
        name: string;
        code: string | null;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        category: import(".prisma/client").$Enums.ServiceType;
        name: string;
        code: string | null;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    }>;
}
