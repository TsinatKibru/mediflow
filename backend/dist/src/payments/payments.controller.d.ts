import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { VoidPaymentDto } from './dto/void-payment.dto';
import { BulkCreatePaymentDto } from './dto/bulk-create-payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    findAll(req: any, skip?: string, take?: string): Promise<{
        total: number;
        data: ({
            visit: {
                department: {
                    id: string;
                    name: string;
                    tenantId: string;
                };
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
            verifiedBy: {
                firstName: string;
                lastName: string;
            } | null;
        } & {
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
        })[];
    }>;
    create(createPaymentDto: CreatePaymentDto, req: any): Promise<{
        payment: {
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
        };
        coverageRecord: any;
    }>;
    findByVisit(visitId: string): Promise<{
        payments: ({
            verifiedBy: {
                firstName: string;
                lastName: string;
            } | null;
        } & {
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
        })[];
        coverage: ({
            verifiedBy: {
                firstName: string;
                lastName: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            visitId: string;
            insurancePolicyId: string | null;
            verifiedById: string | null;
            type: import(".prisma/client").$Enums.CoverageType;
            referenceNumber: string | null;
            issuedToName: string | null;
            issueYear: number | null;
            expiryYear: number | null;
            claimStatus: import(".prisma/client").$Enums.ClaimStatus;
            verifiedAt: Date;
        }) | null;
    }>;
    update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
    bulkCreate(bulkCreatePaymentDto: BulkCreatePaymentDto, req: any): Promise<any[]>;
    void(id: string, voidPaymentDto: VoidPaymentDto, req: any): Promise<{
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
    }>;
    updateClaimStatus(visitId: string, status: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        visitId: string;
        insurancePolicyId: string | null;
        verifiedById: string | null;
        type: import(".prisma/client").$Enums.CoverageType;
        referenceNumber: string | null;
        issuedToName: string | null;
        issueYear: number | null;
        expiryYear: number | null;
        claimStatus: import(".prisma/client").$Enums.ClaimStatus;
        verifiedAt: Date;
    }>;
}
