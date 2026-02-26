import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicationDto, UpdateMedicationDto } from './dto/medication.dto';

@Injectable()
export class MedicationsService {
    constructor(private prisma: PrismaService) { }

    async create(tenantId: string, dto: CreateMedicationDto) {
        return this.prisma.medication.create({
            data: {
                ...dto,
                tenantId,
            },
        });
    }

    async findAll(tenantId: string, query?: string) {
        return this.prisma.medication.findMany({
            where: {
                tenantId,
                OR: query ? [
                    { name: { contains: query, mode: 'insensitive' } },
                    { genericName: { contains: query, mode: 'insensitive' } },
                ] : undefined,
            },
            orderBy: { name: 'asc' },
        });
    }

    async findOne(tenantId: string, id: string) {
        const medication = await this.prisma.medication.findFirst({
            where: { id, tenantId },
        });
        if (!medication) throw new NotFoundException('Medication not found');
        return medication;
    }

    async update(tenantId: string, id: string, dto: UpdateMedicationDto) {
        await this.findOne(tenantId, id);
        return this.prisma.medication.update({
            where: { id },
            data: dto,
        });
    }

    async remove(tenantId: string, id: string) {
        await this.findOne(tenantId, id);
        return this.prisma.medication.delete({
            where: { id },
        });
    }
}
