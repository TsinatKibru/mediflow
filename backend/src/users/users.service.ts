import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateUserDto, tenantId: string) {
        const existingUser = await this.prisma.user.findFirst({
            where: { email: dto.email, tenantId },
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists in your hospital');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // Sanitize departmentId: empty string should be null
        const data: any = {
            ...dto,
            password: hashedPassword,
            tenantId,
        };
        if (data.departmentId === '') {
            data.departmentId = null;
        }

        return this.prisma.user.create({
            data,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                departmentId: true,
                isActive: true,
            }
        });
    }

    async findAll(tenantId: string) {
        return this.prisma.user.findMany({
            where: { tenantId },
            include: {
                department: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string, tenantId: string) {
        const user = await this.prisma.user.findFirst({
            where: { id, tenantId },
            include: { department: true }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async update(id: string, dto: any, tenantId: string) {
        await this.findOne(id, tenantId);

        if (dto.password) {
            dto.password = await bcrypt.hash(dto.password, 10);
        }

        // Sanitize departmentId: empty string should be null
        if (dto.departmentId === '') {
            dto.departmentId = null;
        }

        return this.prisma.user.update({
            where: { id },
            data: dto,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                departmentId: true,
                isActive: true,
            }
        });
    }

    async remove(id: string, tenantId: string) {
        await this.findOne(id, tenantId);
        // We deactivate instead of delete for audit trails
        return this.prisma.user.update({
            where: { id },
            data: { isActive: false }
        });
    }
}
