import { VisitsService } from './visits.service';
import { CreateVisitDto, UpdateVitalsDto, UpdateConsultationDto } from './dto/visit.dto';
export declare class VisitsController {
    private readonly visitsService;
    constructor(visitsService: VisitsService);
    create(req: any, createVisitDto: CreateVisitDto): Promise<{
        department: {
            id: string;
            tenantId: string;
            name: string;
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
        status: import(".prisma/client").$Enums.VisitStatus;
        priority: import(".prisma/client").$Enums.Priority;
        reason: string | null;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        tenantId: string;
        departmentId: string;
        doctorId: string | null;
        nurseId: string | null;
    }>;
    findAll(req: any, skip?: string, take?: string, search?: string, departmentId?: string, status?: string, paymentStatus?: string): Promise<{
        total: number;
        data: ({
            department: {
                id: string;
                tenantId: string;
                name: string;
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
                status: string;
                reason: string | null;
                createdAt: Date;
                updatedAt: Date;
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
                status: string;
                createdAt: Date;
                updatedAt: Date;
                result: string | null;
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
                status: string;
                createdAt: Date;
                updatedAt: Date;
                visitId: string;
                instructions: string | null;
                prescribedById: string;
                medicationId: string;
                quantity: number;
                dispensedById: string | null;
            })[];
        } & {
            id: string;
            status: import(".prisma/client").$Enums.VisitStatus;
            priority: import(".prisma/client").$Enums.Priority;
            reason: string | null;
            createdAt: Date;
            updatedAt: Date;
            patientId: string;
            tenantId: string;
            departmentId: string;
            doctorId: string | null;
            nurseId: string | null;
        })[];
    }>;
    findByPatient(req: any, patientId: string): Promise<({
        department: {
            id: string;
            tenantId: string;
            name: string;
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
    } & {
        id: string;
        status: import(".prisma/client").$Enums.VisitStatus;
        priority: import(".prisma/client").$Enums.Priority;
        reason: string | null;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        tenantId: string;
        departmentId: string;
        doctorId: string | null;
        nurseId: string | null;
    })[]>;
    findOne(req: any, id: string): Promise<{
        department: {
            id: string;
            tenantId: string;
            name: string;
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
            status: string;
            reason: string | null;
            createdAt: Date;
            updatedAt: Date;
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
        doctor: {
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
        nurse: {
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
        status: import(".prisma/client").$Enums.VisitStatus;
        priority: import(".prisma/client").$Enums.Priority;
        reason: string | null;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        tenantId: string;
        departmentId: string;
        doctorId: string | null;
        nurseId: string | null;
    }>;
    updateVitals(req: any, id: string, updateVitalsDto: UpdateVitalsDto): Promise<{
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
    }>;
    updateConsultation(req: any, id: string, updateConsultationDto: UpdateConsultationDto): Promise<{
        id: string;
        createdAt: Date;
        notes: string;
        visitId: string;
        prescription: string | null;
    }>;
}
