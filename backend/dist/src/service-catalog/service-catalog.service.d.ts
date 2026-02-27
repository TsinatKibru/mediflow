import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceCatalogDto, UpdateServiceCatalogDto } from './dto/service-catalog.dto';
export declare class ServiceCatalogService {
    private prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, dto: CreateServiceCatalogDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        tenantId: string;
        category: import(".prisma/client").$Enums.ServiceType;
        code: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
    }>;
    findAll(tenantId: string, category?: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        tenantId: string;
        category: import(".prisma/client").$Enums.ServiceType;
        code: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    findOne(tenantId: string, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        tenantId: string;
        category: import(".prisma/client").$Enums.ServiceType;
        code: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
    }>;
    update(tenantId: string, id: string, dto: UpdateServiceCatalogDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        tenantId: string;
        category: import(".prisma/client").$Enums.ServiceType;
        code: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        tenantId: string;
        category: import(".prisma/client").$Enums.ServiceType;
        code: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
    }>;
}
