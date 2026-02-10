"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let VisitsService = class VisitsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, dto) {
        const { patientId, departmentId, reason } = dto;
        const patient = await this.prisma.patient.findFirst({
            where: { id: patientId, tenantId },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found in this tenant');
        }
        return this.prisma.visit.create({
            data: {
                status: client_1.VisitStatus.REGISTERED,
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
    }
    async findAll(tenantId) {
        return this.prisma.visit.findMany({
            where: { tenantId },
            include: {
                patient: true,
                department: true,
                vitals: true,
                consultation: true,
                payments: true,
                coverage: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByPatient(tenantId, patientId) {
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
    async findOne(tenantId, id) {
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
            throw new common_1.NotFoundException('Visit not found');
        }
        return visit;
    }
    async updateVitals(tenantId, id, nurseId, dto) {
        const visit = await this.prisma.visit.findFirst({
            where: { id, tenantId },
        });
        if (!visit) {
            throw new common_1.NotFoundException('Visit not found');
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
                    status: visit.status === client_1.VisitStatus.REGISTERED ? client_1.VisitStatus.WAITING : visit.status,
                },
            });
            return vitals;
        });
    }
    async updateConsultation(tenantId, id, doctorId, dto) {
        const visit = await this.prisma.visit.findFirst({
            where: { id, tenantId },
        });
        if (!visit) {
            throw new common_1.NotFoundException('Visit not found');
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
                    status: client_1.VisitStatus.COMPLETED,
                },
            });
            return consultation;
        });
    }
};
exports.VisitsService = VisitsService;
exports.VisitsService = VisitsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VisitsService);
//# sourceMappingURL=visits.service.js.map