import { MedicationsService } from './medications.service';
import { CreateMedicationDto, UpdateMedicationDto } from './dto/medication.dto';
export declare class MedicationsController {
    private readonly medicationsService;
    constructor(medicationsService: MedicationsService);
    create(req: any, createMedicationDto: CreateMedicationDto): Promise<{
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
    findAll(req: any, search?: string): Promise<{
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
    findOne(req: any, id: string): Promise<{
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
    update(req: any, id: string, updateMedicationDto: UpdateMedicationDto): Promise<{
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
    remove(req: any, id: string): Promise<{
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
