import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto, req: any): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        departmentId: string | null;
    }>;
    findAll(req: any): Promise<({
        department: {
            name: string;
        } | null;
    } & {
        id: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        departmentId: string | null;
    })[]>;
    findOne(id: string, req: any): Promise<{
        department: {
            id: string;
            tenantId: string;
            name: string;
        } | null;
    } & {
        id: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        departmentId: string | null;
    }>;
    update(id: string, dto: any, req: any): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        departmentId: string | null;
    }>;
    remove(id: string, req: any): Promise<{
        id: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        departmentId: string | null;
    }>;
}
