import { DepartmentsService } from './departments.service';
export declare class DepartmentsController {
    private readonly departmentsService;
    constructor(departmentsService: DepartmentsService);
    findAll(req: any): Promise<{
        id: string;
        name: string;
        tenantId: string;
    }[]>;
}
