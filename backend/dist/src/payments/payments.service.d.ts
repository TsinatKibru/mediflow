import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { VoidPaymentDto } from './dto/void-payment.dto';
import { BulkCreatePaymentDto } from './dto/bulk-create-payment.dto';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createPaymentDto: CreatePaymentDto, userId: string): Promise<{
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
    update(id: string, dto: UpdatePaymentDto): Promise<{
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
        voidedById: string | null;
        insurancePolicyId: string | null;
        verifiedById: string | null;
    }>;
    void(id: string, dto: VoidPaymentDto, userId: string): Promise<{
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
        voidedById: string | null;
        insurancePolicyId: string | null;
        verifiedById: string | null;
    }>;
    bulkCreate(dto: BulkCreatePaymentDto, userId: string): Promise<any[]>;
    updateClaimStatus(visitId: string, status: string, userId: string): Promise<{
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
    findAll(tenantId: string, skip?: number, take?: number): Promise<{
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
            voidedById: string | null;
            insurancePolicyId: string | null;
            verifiedById: string | null;
        })[];
    }>;
}
