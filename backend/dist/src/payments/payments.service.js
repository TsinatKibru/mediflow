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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PaymentsService = class PaymentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createPaymentDto, userId) {
        const { visitId, amountCharged, amountPaid, method, serviceType, reason, coverage, insurancePolicyId } = createPaymentDto;
        const visit = await this.prisma.visit.findUnique({
            where: { id: visitId },
            include: { tenant: true }
        });
        if (!visit) {
            throw new common_1.NotFoundException(`Visit with ID ${visitId} not found`);
        }
        return this.prisma.$transaction(async (tx) => {
            const payment = await tx.payments.create({
                data: {
                    visitId,
                    amountCharged,
                    amountPaid,
                    method,
                    serviceType: serviceType,
                    reason,
                    verifiedById: userId,
                    insurancePolicyId: insurancePolicyId || coverage?.insurancePolicyId,
                },
            });
            let coverageRecord = null;
            if (coverage) {
                const effectivePolicyId = coverage.insurancePolicyId || insurancePolicyId;
                coverageRecord = await tx.coverageRecord.upsert({
                    where: { visitId },
                    create: {
                        visitId,
                        type: coverage.type,
                        referenceNumber: coverage.referenceNumber,
                        issuedToName: coverage.issuedToName,
                        issueYear: coverage.issueYear,
                        expiryYear: coverage.expiryYear,
                        notes: coverage.notes,
                        verifiedById: userId,
                        insurancePolicyId: effectivePolicyId,
                    },
                    update: {
                        type: coverage.type,
                        referenceNumber: coverage.referenceNumber,
                        issuedToName: coverage.issuedToName,
                        issueYear: coverage.issueYear,
                        expiryYear: coverage.expiryYear,
                        notes: coverage.notes,
                        verifiedById: userId,
                        insurancePolicyId: effectivePolicyId,
                    }
                });
            }
            return { payment, coverageRecord };
        });
    }
    async findByVisit(visitId) {
        const payments = await this.prisma.payments.findMany({
            where: { visitId },
            include: {
                verifiedBy: {
                    select: { firstName: true, lastName: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        const coverage = await this.prisma.coverageRecord.findUnique({
            where: { visitId },
            include: {
                verifiedBy: {
                    select: { firstName: true, lastName: true }
                }
            },
        });
        return { payments, coverage };
    }
    async update(id, dto) {
        const payment = await this.prisma.payments.findUnique({
            where: { id }
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with ID ${id} not found`);
        }
        if (payment.isVoided) {
            throw new common_1.BadRequestException('Cannot update a voided transaction');
        }
        return this.prisma.payments.update({
            where: { id },
            data: {
                amountCharged: dto.amountCharged,
                amountPaid: dto.amountPaid,
                method: dto.method,
                serviceType: dto.serviceType,
                reason: dto.reason,
            }
        });
    }
    async void(id, dto, userId) {
        const payment = await this.prisma.payments.findUnique({
            where: { id }
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with ID ${id} not found`);
        }
        if (payment.isVoided) {
            throw new common_1.BadRequestException('Transaction is already voided');
        }
        return this.prisma.payments.update({
            where: { id },
            data: {
                isVoided: true,
                voidReason: dto.reason,
                voidedAt: new Date(),
                voidedById: userId
            }
        });
    }
    async remove(id) {
        return this.prisma.payments.delete({
            where: { id }
        });
    }
    async bulkCreate(dto, userId) {
        const { visitId, payments } = dto;
        const visit = await this.prisma.visit.findUnique({
            where: { id: visitId }
        });
        if (!visit) {
            throw new common_1.NotFoundException(`Visit with ID ${visitId} not found`);
        }
        return this.prisma.$transaction(async (tx) => {
            const results = [];
            for (const p of payments) {
                const created = await tx.payments.create({
                    data: {
                        visitId,
                        amountCharged: p.amountCharged,
                        amountPaid: p.amountPaid,
                        method: p.method,
                        serviceType: p.serviceType,
                        reason: p.reason,
                        verifiedById: userId,
                        insurancePolicyId: p.insurancePolicyId
                    }
                });
                results.push(created);
            }
            return results;
        });
    }
    async updateClaimStatus(visitId, status, userId) {
        const coverage = await this.prisma.coverageRecord.findUnique({
            where: { visitId }
        });
        if (!coverage) {
            throw new common_1.NotFoundException(`Coverage record for visit ${visitId} not found`);
        }
        return this.prisma.coverageRecord.update({
            where: { visitId },
            data: {
                claimStatus: status,
                verifiedById: userId,
                verifiedAt: new Date()
            }
        });
    }
    async findAll(tenantId, skip, take) {
        const where = { visit: { tenantId } };
        const [total, data] = await Promise.all([
            this.prisma.payments.count({ where }),
            this.prisma.payments.findMany({
                where,
                skip,
                take,
                include: {
                    visit: {
                        include: {
                            patient: true,
                            department: true
                        }
                    },
                    verifiedBy: {
                        select: { firstName: true, lastName: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            })
        ]);
        return { total, data };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map