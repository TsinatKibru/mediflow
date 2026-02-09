import { PatientsService } from './patients.service';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';
export declare class PatientsController {
    private readonly patientsService;
    constructor(patientsService: PatientsService);
    create(req: any, createPatientDto: CreatePatientDto): Promise<{
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
    findAll(req: any): Promise<{
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
    }[]>;
    findOne(req: any, id: string): Promise<{
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
    findPatientVisits(req: any, id: string): Promise<({
        department: {
            id: string;
            name: string;
            tenantId: string;
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
            verifiedAt: Date;
        } | null;
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
    remove(req: any, id: string): Promise<{
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
