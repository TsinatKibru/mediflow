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
    findAll(tenantId: string): Promise<{
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
