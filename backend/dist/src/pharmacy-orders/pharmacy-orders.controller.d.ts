import { PharmacyOrdersService } from './pharmacy-orders.service';
import { CreatePharmacyOrderDto, UpdatePharmacyOrderStatusDto } from './dto/pharmacy-order.dto';
export declare class PharmacyOrdersController {
    private readonly pharmacyOrdersService;
    constructor(pharmacyOrdersService: PharmacyOrdersService);
    create(req: any, createPharmacyOrderDto: CreatePharmacyOrderDto): Promise<{
        medication: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        visitId: string;
        instructions: string | null;
        prescribedById: string;
        quantity: number;
        medicationId: string;
        dispensedById: string | null;
    }>;
    findAll(req: any, status?: string): Promise<({
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            reason: string | null;
            visitId: string;
            amountCharged: import("@prisma/client/runtime/library").Decimal;
            amountPaid: import("@prisma/client/runtime/library").Decimal;
            method: import(".prisma/client").$Enums.PaymentMethod;
            serviceType: import(".prisma/client").$Enums.ServiceType;
            isVoided: boolean;
            voidReason: string | null;
            voidedAt: Date | null;
            labOrderId: string | null;
            pharmacyOrderId: string | null;
            voidedById: string | null;
            insurancePolicyId: string | null;
            verifiedById: string | null;
        }[];
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
                notes: string;
                visitId: string;
                prescription: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            departmentId: string;
            status: import(".prisma/client").$Enums.VisitStatus;
            priority: import(".prisma/client").$Enums.Priority;
            reason: string | null;
            patientId: string;
            doctorId: string | null;
            nurseId: string | null;
        };
        prescribedBy: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            departmentId: string | null;
        };
        medication: {
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
        };
        dispensedBy: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            departmentId: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        visitId: string;
        instructions: string | null;
        prescribedById: string;
        quantity: number;
        medicationId: string;
        dispensedById: string | null;
    })[]>;
    findByVisit(req: any, visitId: string): Promise<({
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            reason: string | null;
            visitId: string;
            amountCharged: import("@prisma/client/runtime/library").Decimal;
            amountPaid: import("@prisma/client/runtime/library").Decimal;
            method: import(".prisma/client").$Enums.PaymentMethod;
            serviceType: import(".prisma/client").$Enums.ServiceType;
            isVoided: boolean;
            voidReason: string | null;
            voidedAt: Date | null;
            labOrderId: string | null;
            pharmacyOrderId: string | null;
            voidedById: string | null;
            insurancePolicyId: string | null;
            verifiedById: string | null;
        }[];
        medication: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        visitId: string;
        instructions: string | null;
        prescribedById: string;
        quantity: number;
        medicationId: string;
        dispensedById: string | null;
    })[]>;
    updateStatus(req: any, id: string, dto: UpdatePharmacyOrderStatusDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        visitId: string;
        instructions: string | null;
        prescribedById: string;
        quantity: number;
        medicationId: string;
        dispensedById: string | null;
    }>;
}
