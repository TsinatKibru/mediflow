import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVisitDto, UpdateVitalsDto, UpdateConsultationDto } from './dto/visit.dto';
import { VisitStatus } from '@prisma/client';

@Injectable()
export class VisitsService {
    constructor(private prisma: PrismaService) { }

    async create(tenantId: string, dto: CreateVisitDto) {
        const { patientId, departmentId, reason } = dto;

        // Verify patient belongs to tenant
        const patient = await this.prisma.patient.findFirst({
            where: { id: patientId, tenantId },
        });

        if (!patient) {
            throw new NotFoundException('Patient not found in this tenant');
        }

        return this.prisma.$transaction(async (tx) => {
            const visit = await tx.visit.create({
                data: {
                    status: VisitStatus.REGISTERED,
                    reason,
                    patientId,
                    departmentId,
                    tenantId,
                },
                include: {
                    patient: true,
                    department: true,
                },
            });

            // Auto-create a PENDING registration charge from the catalog
            const regCatalog = await tx.serviceCatalog.findFirst({
                where: { tenantId, category: 'REGISTRATION', isActive: true },
                orderBy: { name: 'asc' },
            });

            await tx.payments.create({
                data: {
                    visitId: visit.id,
                    amountCharged: regCatalog ? Number(regCatalog.price) : 0,
                    amountPaid: 0,
                    method: 'CASH',
                    serviceType: 'REGISTRATION',
                    status: 'PENDING',
                    reason: regCatalog ? regCatalog.name : 'Registration Fee',
                },
            });

            return visit;
        });
    }

    async findAll(
        tenantId: string,
        options: {
            skip?: number;
            take?: number;
            search?: string;
            departmentId?: string;
            status?: string;
            userRole?: string;
            userDepartmentId?: string;
        },
    ) {
        const { skip, take, search, departmentId, status, userRole, userDepartmentId } = options;

        const where: any = { tenantId };

        // If it's a doctor and no specific department is requested, default to their department
        if (userRole === 'DOCTOR' && userDepartmentId && !departmentId) {
            where.departmentId = userDepartmentId;
        } else if (departmentId) {
            where.departmentId = departmentId;
        }

        if (status) {
            where.status = status;
        }

        if (search) {
            where.patient = {
                OR: [
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
                ],
            };
        }

        const [total, data] = await Promise.all([
            this.prisma.visit.count({ where }),
            this.prisma.visit.findMany({
                where,
                skip,
                take,
                include: {
                    patient: true,
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
            }),
        ]);

        return { total, data };
    }

    async findByPatient(tenantId: string, patientId: string) {
        return this.prisma.visit.findMany({
            where: { tenantId, patientId },
            include: {
                patient: true,
                department: true,
                vitals: true,
                consultation: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(tenantId: string, id: string) {
        const visit = await this.prisma.visit.findFirst({
            where: { id, tenantId },
            include: {
                patient: true,
                department: true,
                vitals: true,
                consultation: true,
                doctor: true,
                nurse: true,
                payments: true,
                coverage: true,
            },
        });

        if (!visit) {
            throw new NotFoundException('Visit not found');
        }

        return visit;
    }

    async updateVitals(tenantId: string, id: string, nurseId: string, dto: UpdateVitalsDto) {
        // Ensure visit belongs to tenant
        const visit = await this.prisma.visit.findFirst({
            where: { id, tenantId },
        });

        if (!visit) {
            throw new NotFoundException('Visit not found');
        }

        return this.prisma.$transaction(async (tx) => {
            const vitals = await tx.vitals.upsert({
                where: { visitId: id },
                create: {
                    visitId: id,
                    temperature: dto.temperature,
                    bpSystolic: dto.bpSystolic,
                    bpDiastolic: dto.bpDiastolic,
                    pulse: dto.heartRate,
                    weight: dto.weight,
                    height: dto.height,
                },
                update: {
                    temperature: dto.temperature,
                    bpSystolic: dto.bpSystolic,
                    bpDiastolic: dto.bpDiastolic,
                    pulse: dto.heartRate,
                    weight: dto.weight,
                    height: dto.height,
                },
            });

            await tx.visit.update({
                where: { id },
                data: {
                    nurseId,
                    status: visit.status === VisitStatus.REGISTERED ? VisitStatus.WAITING : visit.status,
                },
            });

            return vitals;
        });
    }

    async updateConsultation(tenantId: string, id: string, doctorId: string, dto: UpdateConsultationDto) {
        const visit = await this.prisma.visit.findFirst({
            where: { id, tenantId },
        });

        if (!visit) {
            throw new NotFoundException('Visit not found');
        }

        return this.prisma.$transaction(async (tx) => {
            const consultation = await tx.consultation.upsert({
                where: { visitId: id },
                create: {
                    visitId: id,
                    notes: dto.notes,
                    prescription: dto.prescription,
                },
                update: {
                    notes: dto.notes,
                    prescription: dto.prescription,
                },
            });

            await tx.visit.update({
                where: { id },
                data: {
                    doctorId,
                    status: VisitStatus.COMPLETED,
                },
            });

            return consultation;
        });
    }
}
