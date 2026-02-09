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

    async findAll(tenantId: string) {
        return this.prisma.patient.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
        });
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
