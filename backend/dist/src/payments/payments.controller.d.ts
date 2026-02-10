import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(createPaymentDto: CreatePaymentDto, req: any): Promise<{
        payment: {
            id: string;
            amountCharged: import("@prisma/client/runtime/library").Decimal;
            amountPaid: import("@prisma/client/runtime/library").Decimal;
            method: import(".prisma/client").$Enums.PaymentMethod;
            serviceType: import(".prisma/client").$Enums.ServiceType;
            status: string;
            reason: string | null;
            createdAt: Date;
            updatedAt: Date;
            visitId: string;
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
            amountCharged: import("@prisma/client/runtime/library").Decimal;
            amountPaid: import("@prisma/client/runtime/library").Decimal;
            method: import(".prisma/client").$Enums.PaymentMethod;
            serviceType: import(".prisma/client").$Enums.ServiceType;
            status: string;
            reason: string | null;
            createdAt: Date;
            updatedAt: Date;
            visitId: string;
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
            visitId: string;
            insurancePolicyId: string | null;
            verifiedById: string | null;
            type: import(".prisma/client").$Enums.CoverageType;
            referenceNumber: string | null;
            issuedToName: string | null;
            issueYear: number | null;
            expiryYear: number | null;
            notes: string | null;
            verifiedAt: Date;
        }) | null;
    }>;
    update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<{
        id: string;
        amountCharged: import("@prisma/client/runtime/library").Decimal;
        amountPaid: import("@prisma/client/runtime/library").Decimal;
        method: import(".prisma/client").$Enums.PaymentMethod;
        serviceType: import(".prisma/client").$Enums.ServiceType;
        status: string;
        reason: string | null;
        createdAt: Date;
        updatedAt: Date;
        visitId: string;
        insurancePolicyId: string | null;
        verifiedById: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        amountCharged: import("@prisma/client/runtime/library").Decimal;
        amountPaid: import("@prisma/client/runtime/library").Decimal;
        method: import(".prisma/client").$Enums.PaymentMethod;
        serviceType: import(".prisma/client").$Enums.ServiceType;
        status: string;
        reason: string | null;
        createdAt: Date;
        updatedAt: Date;
        visitId: string;
        insurancePolicyId: string | null;
        verifiedById: string | null;
    }>;
}
