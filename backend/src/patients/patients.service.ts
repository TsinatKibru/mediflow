import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';

@Injectable()
export class PatientsService {
    constructor(private prisma: PrismaService) { }

    async create(tenantId: string, dto: CreatePatientDto) {
        return this.prisma.patient.create({
            data: {
                ...dto,
                tenantId,
            },
        });
    }

    async findAll(
        tenantId: string,
        skip?: number,
        take?: number,
        search?: string,
    ) {
        const where: any = { tenantId };

        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [total, data] = await Promise.all([
            this.prisma.patient.count({ where }),
            this.prisma.patient.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
            }),
        ]);

        return { total, data };
    }

    async findOne(tenantId: string, id: string) {
        const patient = await this.prisma.patient.findFirst({
            where: { id, tenantId },
        });

        if (!patient) {
            throw new NotFoundException('Patient not found');
        }

        return patient;
    }

    async findPatientVisits(tenantId: string, patientId: string) {
        // Ensure patient belongs to tenant
        await this.findOne(tenantId, patientId);

        return this.prisma.visit.findMany({
            where: {
                patientId,
                tenantId,
            },
            include: {
                department: true,
                vitals: true,
                consultation: true,
                payments: true,
                coverage: true,
                labOrders: true,
                pharmacyOrders: {
                    include: {
                        medication: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async update(tenantId: string, id: string, dto: UpdatePatientDto) {
        // Ensure patient belongs to tenant
        await this.findOne(tenantId, id);

        return this.prisma.patient.update({
            where: { id },
            data: dto,
        });
    }

    async remove(tenantId: string, id: string) {
        // Ensure patient belongs to tenant
        await this.findOne(tenantId, id);

        return this.prisma.patient.delete({
            where: { id },
        });
    }
}
