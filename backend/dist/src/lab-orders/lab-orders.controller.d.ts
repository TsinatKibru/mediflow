import { LabOrdersService } from './lab-orders.service';
import { CreateLabOrderDto, UpdateLabOrderDto } from './dto/lab-order.dto';
export declare class LabOrdersController {
    private readonly labOrdersService;
    constructor(labOrdersService: LabOrdersService);
    findAll(req: any, status?: string): Promise<({
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
    create(req: any, createLabOrderDto: CreateLabOrderDto): Promise<{
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
    findByVisit(req: any, visitId: string): Promise<({
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
    update(req: any, id: string, updateLabOrderDto: UpdateLabOrderDto): Promise<{
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
    remove(req: any, id: string): Promise<{
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
