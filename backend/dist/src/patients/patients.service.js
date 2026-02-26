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
exports.PatientsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PatientsService = class PatientsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, dto) {
        return this.prisma.patient.create({
            data: {
                ...dto,
                dateOfBirth: new Date(dto.dateOfBirth),
                tenantId,
            },
        });
    }
    async findAll(tenantId, skip, take, search) {
        const where = { tenantId };
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
    async findOne(tenantId, id) {
        const patient = await this.prisma.patient.findFirst({
            where: { id, tenantId },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        return patient;
    }
    async findPatientVisits(tenantId, patientId) {
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
    async update(tenantId, id, dto) {
        await this.findOne(tenantId, id);
        return this.prisma.patient.update({
            where: { id },
            data: {
                ...dto,
                dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
            },
        });
    }
    async remove(tenantId, id) {
        await this.findOne(tenantId, id);
        return this.prisma.patient.delete({
            where: { id },
        });
    }
};
exports.PatientsService = PatientsService;
exports.PatientsService = PatientsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PatientsService);
//# sourceMappingURL=patients.service.js.map