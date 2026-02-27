import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateUserDto, tenantId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        departmentId: string | null;
    }>;
    findAll(tenantId: string): Promise<({
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
    findOne(id: string, tenantId: string): Promise<{
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
    update(id: string, dto: any, tenantId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        departmentId: string | null;
    }>;
    remove(id: string, tenantId: string): Promise<{
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
