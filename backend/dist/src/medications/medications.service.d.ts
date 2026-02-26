import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicationDto, UpdateMedicationDto } from './dto/medication.dto';
export declare class MedicationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, dto: CreateMedicationDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        genericName: string | null;
        dosageForm: string;
        strength: string;
        stockBalance: number;
        unitPrice: import("@prisma/client/runtime/library").Decimal;
    }>;
    findAll(tenantId: string, query?: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        genericName: string | null;
        dosageForm: string;
        strength: string;
        stockBalance: number;
        unitPrice: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    findOne(tenantId: string, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        genericName: string | null;
        dosageForm: string;
        strength: string;
        stockBalance: number;
        unitPrice: import("@prisma/client/runtime/library").Decimal;
    }>;
    update(tenantId: string, id: string, dto: UpdateMedicationDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        genericName: string | null;
        dosageForm: string;
        strength: string;
        stockBalance: number;
        unitPrice: import("@prisma/client/runtime/library").Decimal;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        genericName: string | null;
        dosageForm: string;
        strength: string;
        stockBalance: number;
        unitPrice: import("@prisma/client/runtime/library").Decimal;
    }>;
}
