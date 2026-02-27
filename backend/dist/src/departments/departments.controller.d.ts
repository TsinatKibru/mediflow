import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
export declare class DepartmentsController {
    private readonly departmentsService;
    constructor(departmentsService: DepartmentsService);
    findAll(req: any): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date | null;
    }[]>;
    findOne(req: any, id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date | null;
    } | null>;
    create(req: any, createDepartmentDto: CreateDepartmentDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date | null;
    }>;
    update(req: any, id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date | null;
    }>;
    remove(req: any, id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date | null;
    }>;
}
