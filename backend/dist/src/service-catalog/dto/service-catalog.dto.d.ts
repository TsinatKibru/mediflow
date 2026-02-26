import { ServiceType } from '@prisma/client';
export declare class CreateServiceCatalogDto {
    category: ServiceType;
    name: string;
    code?: string;
    description?: string;
    price: number;
    isActive?: boolean;
}
export declare class UpdateServiceCatalogDto {
    category?: ServiceType;
    name?: string;
    code?: string;
    description?: string;
    price?: number;
    isActive?: boolean;
}
