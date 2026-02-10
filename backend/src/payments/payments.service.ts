import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

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

        return this.prisma.payments.update({
            where: { id },
            data: {
                amountCharged: dto.amountCharged,
                amountPaid: dto.amountPaid,
                method: dto.method,
                serviceType: dto.serviceType as any,
                reason: dto.reason,
            }
        });
    }

    async remove(id: string) {
        const payment = await this.prisma.payments.findUnique({
            where: { id }
        });

        if (!payment) {
            throw new NotFoundException(`Payment with ID ${id} not found`);
        }

        return this.prisma.payments.delete({
            where: { id }
        });
    }
}
