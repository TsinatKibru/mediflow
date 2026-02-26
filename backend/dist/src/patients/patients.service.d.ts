import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';
export declare class PatientsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, dto: CreatePatientDto): Promise<{
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
    }>;
    findAll(tenantId: string, skip?: number, take?: number, search?: string): Promise<{
        total: number;
        data: {
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
        }[];
    }>;
    findOne(tenantId: string, id: string): Promise<{
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
    }>;
    findPatientVisits(tenantId: string, patientId: string): Promise<({
        department: {
            id: string;
            name: string;
            tenantId: string;
        };
        labOrders: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            result: string | null;
            status: string;
            visitId: string;
            instructions: string | null;
            testName: string;
            prescribedById: string;
        }[];
        pharmacyOrders: ({
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
            medicationId: string;
            quantity: number;
            dispensedById: string | null;
        })[];
        vitals: {
            id: string;
            createdAt: Date;
            height: number | null;
            weight: number | null;
            bpSystolic: number | null;
            bpDiastolic: number | null;
            temperature: number | null;
            pulse: number | null;
            notes: string | null;
            visitId: string;
        } | null;
        consultation: {
            id: string;
            createdAt: Date;
            notes: string;
            visitId: string;
            prescription: string | null;
        } | null;
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
            labOrderId: string | null;
            pharmacyOrderId: string | null;
            isVoided: boolean;
            voidReason: string | null;
            voidedAt: Date | null;
            voidedById: string | null;
            insurancePolicyId: string | null;
            verifiedById: string | null;
        }[];
        coverage: {
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
    })[]>;
    update(tenantId: string, id: string, dto: UpdatePatientDto): Promise<{
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
    }>;
    remove(tenantId: string, id: string): Promise<{
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
    }>;
}
