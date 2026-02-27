import { PrismaService } from '../prisma/prisma.service';
export declare class DepartmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date | null;
    }[]>;
    findOne(tenantId: string, id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date | null;
    } | null>;
    create(tenantId: string, data: any): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date | null;
    }>;
    update(tenantId: string, id: string, data: any): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date | null;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date | null;
    }>;
}
