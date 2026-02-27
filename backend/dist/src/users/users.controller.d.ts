import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto, req: any): Promise<{
        id: string;
        isActive: boolean;
        firstName: string;
        lastName: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        departmentId: string | null;
    }>;
    findAll(req: any): Promise<({
        department: {
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        tenantId: string;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        departmentId: string | null;
    })[]>;
    findOne(id: string, req: any): Promise<{
        department: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date | null;
            description: string | null;
            isActive: boolean;
            tenantId: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        tenantId: string;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        departmentId: string | null;
    }>;
    update(id: string, dto: any, req: any): Promise<{
        id: string;
        isActive: boolean;
        firstName: string;
        lastName: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        departmentId: string | null;
    }>;
    remove(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        tenantId: string;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        departmentId: string | null;
    }>;
}
