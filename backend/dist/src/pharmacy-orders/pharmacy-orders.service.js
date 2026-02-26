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
exports.PharmacyOrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PharmacyOrdersService = class PharmacyOrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, prescribedById, dto) {
        const medication = await this.prisma.medication.findFirst({
            where: { id: dto.medicationId, tenantId },
        });
        if (!medication) {
            throw new common_1.NotFoundException('Medication not found');
        }
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.pharmacyOrder.create({
                data: {
                    ...dto,
                    prescribedById,
                    status: 'PENDING',
                },
                include: {
                    medication: true,
                },
            });
            const amountCharged = Number(order.medication.unitPrice) * order.quantity;
            await tx.payments.create({
                data: {
                    visitId: order.visitId,
                    amountCharged,
                    amountPaid: 0,
                    method: 'CASH',
                    serviceType: 'PHARMACY',
                    status: 'PENDING',
                    pharmacyOrderId: order.id,
                    reason: `Prescription: ${order.medication.name} (${order.quantity} units)`,
                },
            });
            return order;
        });
    }
    async findAll(tenantId, status) {
        return this.prisma.pharmacyOrder.findMany({
            where: {
                visit: { tenantId },
                status: status || undefined,
            },
            include: {
                medication: true,
                visit: {
                    include: {
                        patient: true,
                        consultation: true,
                    },
                },
                prescribedBy: true,
                dispensedBy: true,
                payments: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByVisit(tenantId, visitId) {
        return this.prisma.pharmacyOrder.findMany({
            where: {
                visitId,
                visit: { tenantId },
            },
            include: {
                medication: true,
                payments: true,
            },
        });
    }
    async updateStatus(tenantId, id, userId, dto) {
        const order = await this.prisma.pharmacyOrder.findFirst({
            where: { id, visit: { tenantId } },
            include: { medication: true },
        });
        if (!order)
            throw new common_1.NotFoundException('Pharmacy order not found');
        if (dto.status === 'DISPENSED' && order.status === 'PENDING') {
            if (order.medication.stockBalance < order.quantity) {
                throw new common_1.BadRequestException('Insufficient stock balance');
            }
            return this.prisma.$transaction(async (tx) => {
                await tx.medication.update({
                    where: { id: order.medicationId },
                    data: {
                        stockBalance: { decrement: order.quantity },
                    },
                });
                return tx.pharmacyOrder.update({
                    where: { id },
                    data: {
                        status: 'DISPENSED',
                        dispensedById: userId,
                    },
                });
            });
        }
        return this.prisma.pharmacyOrder.update({
            where: { id },
            data: { status: dto.status },
        });
    }
};
exports.PharmacyOrdersService = PharmacyOrdersService;
exports.PharmacyOrdersService = PharmacyOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PharmacyOrdersService);
//# sourceMappingURL=pharmacy-orders.service.js.map