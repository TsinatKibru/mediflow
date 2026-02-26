import { PrismaService } from '../prisma/prisma.service';
import { CreateLabOrderDto, UpdateLabOrderDto } from './dto/lab-order.dto';
export declare class LabOrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string, status?: string): Promise<({
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
        instructions: string | null;
        testName: string;
        prescribedById: string;
    })[]>;
    create(tenantId: string, doctorId: string, dto: CreateLabOrderDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        result: string | null;
        status: string;
        visitId: string;
        instructions: string | null;
        testName: string;
        prescribedById: string;
    }>;
    findByVisit(tenantId: string, visitId: string): Promise<({
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
        instructions: string | null;
        testName: string;
        prescribedById: string;
    })[]>;
    update(tenantId: string, id: string, dto: UpdateLabOrderDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        result: string | null;
        status: string;
        visitId: string;
        instructions: string | null;
        testName: string;
        prescribedById: string;
    }>;
    delete(tenantId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        result: string | null;
        status: string;
        visitId: string;
        instructions: string | null;
        testName: string;
        prescribedById: string;
    }>;
}
