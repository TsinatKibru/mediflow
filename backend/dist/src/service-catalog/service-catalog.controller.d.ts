import { ServiceCatalogService } from './service-catalog.service';
import { CreateServiceCatalogDto, UpdateServiceCatalogDto } from './dto/service-catalog.dto';
export declare class ServiceCatalogController {
    private readonly serviceCatalogService;
    constructor(serviceCatalogService: ServiceCatalogService);
    create(req: any, dto: CreateServiceCatalogDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        isActive: boolean;
        category: import(".prisma/client").$Enums.ServiceType;
        code: string | null;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
    }>;
    findAll(req: any, category?: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        isActive: boolean;
        category: import(".prisma/client").$Enums.ServiceType;
        code: string | null;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    findOne(req: any, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        isActive: boolean;
        category: import(".prisma/client").$Enums.ServiceType;
        code: string | null;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
    }>;
    update(req: any, id: string, dto: UpdateServiceCatalogDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        isActive: boolean;
        category: import(".prisma/client").$Enums.ServiceType;
        code: string | null;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
    }>;
    remove(req: any, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        isActive: boolean;
        category: import(".prisma/client").$Enums.ServiceType;
        code: string | null;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
    }>;
}
