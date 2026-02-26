import { PharmacyOrdersService } from './pharmacy-orders.service';
import { CreatePharmacyOrderDto, UpdatePharmacyOrderStatusDto } from './dto/pharmacy-order.dto';
export declare class PharmacyOrdersController {
    private readonly pharmacyOrdersService;
    constructor(pharmacyOrdersService: PharmacyOrdersService);
    create(req: any, createPharmacyOrderDto: CreatePharmacyOrderDto): Promise<{
        medication: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            genericName: string | null;
            dosageForm: string;
            strength: string;
            stockBalance: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            tenantId: string;
        };
    } & {
        id: string;
        quantity: number;
        instructions: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        medicationId: string;
        visitId: string;
        prescribedById: string;
        dispensedById: string | null;
    }>;
    findAll(req: any, status?: string): Promise<({
        medication: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            genericName: string | null;
            dosageForm: string;
            strength: string;
            stockBalance: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            tenantId: string;
        };
        visit: {
            patient: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                tenantId: string;
                firstName: string;
                lastName: string;
                dateOfBirth: Date;
                gender: string;
                phone: string | null;
                email: string | null;
            };
            consultation: {
                id: string;
                createdAt: Date;
                visitId: string;
                notes: string;
                prescription: string | null;
            } | null;
        } & {
            id: string;
            status: import(".prisma/client").$Enums.VisitStatus;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            priority: import(".prisma/client").$Enums.Priority;
            reason: string | null;
            patientId: string;
            departmentId: string;
            doctorId: string | null;
            nurseId: string | null;
        };
        prescribedBy: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            departmentId: string | null;
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
        };
        dispensedBy: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            departmentId: string | null;
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
        } | null;
    } & {
        id: string;
        quantity: number;
        instructions: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        medicationId: string;
        visitId: string;
        prescribedById: string;
        dispensedById: string | null;
    })[]>;
    findByVisit(req: any, visitId: string): Promise<({
        medication: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            genericName: string | null;
            dosageForm: string;
            strength: string;
            stockBalance: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            tenantId: string;
        };
    } & {
        id: string;
        quantity: number;
        instructions: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        medicationId: string;
        visitId: string;
        prescribedById: string;
        dispensedById: string | null;
    })[]>;
    updateStatus(req: any, id: string, dto: UpdatePharmacyOrderStatusDto): Promise<{
        id: string;
        quantity: number;
        instructions: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        medicationId: string;
        visitId: string;
        prescribedById: string;
        dispensedById: string | null;
    }>;
}
