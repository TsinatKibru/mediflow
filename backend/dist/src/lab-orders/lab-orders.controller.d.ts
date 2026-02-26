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
            status: import(".prisma/client").$Enums.VisitStatus;
            createdAt: Date;
            updatedAt: Date;
            priority: import(".prisma/client").$Enums.Priority;
            reason: string | null;
            patientId: string;
            tenantId: string;
            departmentId: string;
            doctorId: string | null;
            nurseId: string | null;
        };
        prescribedBy: {
            firstName: string;
            lastName: string;
        };
    } & {
        result: string | null;
        id: string;
        testName: string;
        instructions: string | null;
        status: string;
        visitId: string;
        prescribedById: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    create(req: any, createLabOrderDto: CreateLabOrderDto): Promise<{
        result: string | null;
        id: string;
        testName: string;
        instructions: string | null;
        status: string;
        visitId: string;
        prescribedById: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByVisit(req: any, visitId: string): Promise<({
        prescribedBy: {
            firstName: string;
            lastName: string;
        };
    } & {
        result: string | null;
        id: string;
        testName: string;
        instructions: string | null;
        status: string;
        visitId: string;
        prescribedById: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    update(req: any, id: string, updateLabOrderDto: UpdateLabOrderDto): Promise<{
        result: string | null;
        id: string;
        testName: string;
        instructions: string | null;
        status: string;
        visitId: string;
        prescribedById: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(req: any, id: string): Promise<{
        result: string | null;
        id: string;
        testName: string;
        instructions: string | null;
        status: string;
        visitId: string;
        prescribedById: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
