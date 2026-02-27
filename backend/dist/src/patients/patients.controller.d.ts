import { PatientsService } from './patients.service';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';
export declare class PatientsController {
    private readonly patientsService;
    constructor(patientsService: PatientsService);
    create(req: any, createPatientDto: CreatePatientDto): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        dateOfBirth: Date;
        gender: string;
        phone: string | null;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    }>;
    findAll(req: any, skip?: string, take?: string, search?: string): Promise<{
        total: number;
        data: {
            id: string;
            firstName: string;
            lastName: string;
            dateOfBirth: Date;
            gender: string;
            phone: string | null;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
        }[];
    }>;
    findOne(req: any, id: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        dateOfBirth: Date;
        gender: string;
        phone: string | null;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    }>;
    findPatientVisits(req: any, id: string): Promise<({
        department: {
            id: string;
            tenantId: string;
            name: string;
        };
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
        labOrders: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            result: string | null;
            status: string;
            visitId: string;
            testName: string;
            instructions: string | null;
            prescribedById: string;
        }[];
        pharmacyOrders: ({
            medication: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                tenantId: string;
                name: string;
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        status: import(".prisma/client").$Enums.VisitStatus;
        priority: import(".prisma/client").$Enums.Priority;
        reason: string | null;
        patientId: string;
        departmentId: string;
        doctorId: string | null;
        nurseId: string | null;
    })[]>;
    update(req: any, id: string, updatePatientDto: UpdatePatientDto): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        dateOfBirth: Date;
        gender: string;
        phone: string | null;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    }>;
    remove(req: any, id: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        dateOfBirth: Date;
        gender: string;
        phone: string | null;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    }>;
}
