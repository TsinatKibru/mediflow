import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { VoidPaymentDto } from './dto/void-payment.dto';
import { BulkCreatePaymentDto } from './dto/bulk-create-payment.dto';

@Injectable()
export class PaymentsService {
    constructor(private prisma: PrismaService) { }

    async create(createPaymentDto: CreatePaymentDto, userId: string) {
        const { visitId, amountCharged, amountPaid, method, serviceType, reason, coverage, insurancePolicyId } = createPaymentDto;

        // Check if visit exists
        const visit = await this.prisma.visit.findUnique({
            where: { id: visitId },
            include: { tenant: true }
        });

        if (!visit) {
            throw new NotFoundException(`Visit with ID ${visitId} not found`);
        }

        return this.prisma.$transaction(async (tx) => {
            // 1. Create Payment record
            const payment = await tx.payments.create({
                data: {
                    visitId,
                    amountCharged,
                    amountPaid,
                    method,
                    serviceType: serviceType as any,
                    status: createPaymentDto.status || 'COMPLETED',
                    labOrderId: createPaymentDto.labOrderId,
                    pharmacyOrderId: createPaymentDto.pharmacyOrderId,
                    reason,
                    verifiedById: userId,
                    insurancePolicyId: insurancePolicyId || coverage?.insurancePolicyId,
                },
            });

            // 2. Create/Update Coverage Record if provided
            let coverageRecord: any = null;
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

    async findByVisit(visitId: string) {
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

    async update(id: string, dto: UpdatePaymentDto) {
        const payment = await this.prisma.payments.findUnique({
            where: { id }
        });

        if (!payment) {
            throw new NotFoundException(`Payment with ID ${id} not found`);
        }

        if (payment.isVoided) {
            throw new BadRequestException('Cannot update a voided transaction');
        }

        return this.prisma.payments.update({
            where: { id },
            data: {
                amountCharged: dto.amountCharged,
                amountPaid: dto.amountPaid,
                method: dto.method,
                status: dto.status,
                serviceType: dto.serviceType as any,
                reason: dto.reason,
            }
        });
    }

    async void(id: string, dto: VoidPaymentDto, userId: string) {
        const payment = await this.prisma.payments.findUnique({
            where: { id }
        });

        if (!payment) {
            throw new NotFoundException(`Payment with ID ${id} not found`);
        }

        if (payment.isVoided) {
            throw new BadRequestException('Transaction is already voided');
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

    async remove(id: string) {
        // We no longer delete, we void. 
        // This is kept for compatibility but should be replaced by void()
        return this.prisma.payments.delete({
            where: { id }
        });
    }

    async bulkCreate(dto: BulkCreatePaymentDto, userId: string) {
        const { visitId, payments } = dto;

        // Check if visit exists
        const visit = await this.prisma.visit.findUnique({
            where: { id: visitId }
        });

        if (!visit) {
            throw new NotFoundException(`Visit with ID ${visitId} not found`);
        }

        return this.prisma.$transaction(async (tx) => {
            const results: any[] = [];
            for (const p of payments) {
                const created = await tx.payments.create({
                    data: {
                        visitId,
                        amountCharged: p.amountCharged,
                        amountPaid: p.amountPaid,
                        method: p.method,
                        serviceType: p.serviceType as any,
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

    async updateClaimStatus(visitId: string, status: string, userId: string) {
        const coverage = await this.prisma.coverageRecord.findUnique({
            where: { visitId }
        });

        if (!coverage) {
            throw new NotFoundException(`Coverage record for visit ${visitId} not found`);
        }

        return this.prisma.coverageRecord.update({
            where: { visitId },
            data: {
                claimStatus: status as any,
                verifiedById: userId,
                verifiedAt: new Date()
            }
        });
    }

    async findAll(tenantId: string, skip?: number, take?: number) {
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
}
