import { ServiceCatalogService } from './service-catalog.service';
import { CreateServiceCatalogDto, UpdateServiceCatalogDto } from './dto/service-catalog.dto';
export declare class ServiceCatalogController {
    private readonly serviceCatalogService;
    constructor(serviceCatalogService: ServiceCatalogService);
    create(req: any, dto: CreateServiceCatalogDto): Promise<{
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
    findAll(req: any, category?: string): Promise<{
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
    findOne(req: any, id: string): Promise<{
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
    update(req: any, id: string, dto: UpdateServiceCatalogDto): Promise<{
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
    remove(req: any, id: string): Promise<{
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
