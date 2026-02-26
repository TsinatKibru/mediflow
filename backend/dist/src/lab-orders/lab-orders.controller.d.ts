import { LabOrdersService } from './lab-orders.service';
import { CreateLabOrderDto, UpdateLabOrderDto } from './dto/lab-order.dto';
export declare class LabOrdersController {
    private readonly labOrdersService;
    constructor(labOrdersService: LabOrdersService);
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
                firstName: string;
                lastName: string;
            };
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
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        result: string | null;
        status: string;
        visitId: string;
        testName: string;
        instructions: string | null;
        prescribedById: string;
    })[]>;
    create(req: any, createLabOrderDto: CreateLabOrderDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        result: string | null;
        status: string;
        visitId: string;
        testName: string;
        instructions: string | null;
        prescribedById: string;
    }>;
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
        prescribedBy: {
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        result: string | null;
        status: string;
        visitId: string;
        testName: string;
        instructions: string | null;
        prescribedById: string;
    })[]>;
    update(req: any, id: string, updateLabOrderDto: UpdateLabOrderDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        result: string | null;
        status: string;
        visitId: string;
        testName: string;
        instructions: string | null;
        prescribedById: string;
    }>;
    remove(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        result: string | null;
        status: string;
        visitId: string;
        testName: string;
        instructions: string | null;
        prescribedById: string;
    }>;
}
