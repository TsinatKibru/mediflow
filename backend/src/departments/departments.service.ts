import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DepartmentsService {
    constructor(private prisma: PrismaService) { }

    async findAll(tenantId: string) {
        return this.prisma.department.findMany({
            where: { tenantId },
            orderBy: { name: 'asc' },
        });
    }

    async findOne(tenantId: string, id: string) {
        return this.prisma.department.findFirst({
            where: { id, tenantId },
        });
    }

    async create(tenantId: string, data: any) {
        return this.prisma.department.create({
            data: {
                ...data,
                tenantId,
            },
        });
    }

    async update(tenantId: string, id: string, data: any) {
        return this.prisma.department.update({
            where: { id, tenantId },
            data,
        });
    }

    async remove(tenantId: string, id: string) {
        return this.prisma.department.delete({
            where: { id, tenantId },
        });
    }
}
