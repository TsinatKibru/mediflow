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
exports.LabOrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LabOrdersService = class LabOrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(tenantId, status) {
        return this.prisma.labOrder.findMany({
            where: {
                visit: { tenantId },
                ...(status ? { status: status } : {}),
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
    async create(tenantId, doctorId, dto) {
        const visit = await this.prisma.visit.findFirst({
            where: { id: dto.visitId, tenantId },
        });
        if (!visit) {
            throw new common_1.NotFoundException('Visit not found');
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
    async findByVisit(tenantId, visitId) {
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
    async update(tenantId, id, dto) {
        const labOrder = await this.prisma.labOrder.findUnique({
            where: { id },
            include: { visit: true },
        });
        if (!labOrder || labOrder.visit.tenantId !== tenantId) {
            throw new common_1.NotFoundException('Lab order not found');
        }
        return this.prisma.labOrder.update({
            where: { id },
            data: dto,
        });
    }
    async delete(tenantId, id) {
        const labOrder = await this.prisma.labOrder.findUnique({
            where: { id },
            include: { visit: true },
        });
        if (!labOrder || labOrder.visit.tenantId !== tenantId) {
            throw new common_1.NotFoundException('Lab order not found');
        }
        return this.prisma.labOrder.delete({
            where: { id },
        });
    }
};
exports.LabOrdersService = LabOrdersService;
exports.LabOrdersService = LabOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LabOrdersService);
//# sourceMappingURL=lab-orders.service.js.map