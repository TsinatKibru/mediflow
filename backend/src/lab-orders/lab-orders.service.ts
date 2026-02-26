import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLabOrderDto, UpdateLabOrderDto } from './dto/lab-order.dto';

@Injectable()
export class LabOrdersService {
    constructor(private prisma: PrismaService) { }

    async findAll(tenantId: string, status?: string) {
        return this.prisma.labOrder.findMany({
            where: {
                visit: { tenantId },
                ...(status ? { status: status as any } : {}),
            },
            include: {
                prescribedBy: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
                visit: {
                    include: {
                        patient: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async create(tenantId: string, doctorId: string, dto: CreateLabOrderDto) {
        // Verify visit belongs to tenant
        const visit = await this.prisma.visit.findFirst({
            where: { id: dto.visitId, tenantId },
        });

        if (!visit) {
            throw new NotFoundException('Visit not found');
        }

        return this.prisma.labOrder.create({
            data: {
                testName: dto.testName,
                instructions: dto.instructions,
                visitId: dto.visitId,
                prescribedById: doctorId,
            },
        });
    }

    async findByVisit(tenantId: string, visitId: string) {
        return this.prisma.labOrder.findMany({
            where: {
                visitId,
                visit: { tenantId },
            },
            include: {
                prescribedBy: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async update(tenantId: string, id: string, dto: UpdateLabOrderDto) {
        const labOrder = await this.prisma.labOrder.findUnique({
            where: { id },
            include: { visit: true },
        });

        if (!labOrder || labOrder.visit.tenantId !== tenantId) {
            throw new NotFoundException('Lab order not found');
        }

        return this.prisma.labOrder.update({
            where: { id },
            data: dto,
        });
    }

    async delete(tenantId: string, id: string) {
        const labOrder = await this.prisma.labOrder.findUnique({
            where: { id },
            include: { visit: true },
        });

        if (!labOrder || labOrder.visit.tenantId !== tenantId) {
            throw new NotFoundException('Lab order not found');
        }

        return this.prisma.labOrder.delete({
            where: { id },
        });
    }
}
