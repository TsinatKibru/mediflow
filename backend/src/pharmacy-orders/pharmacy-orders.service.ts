import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePharmacyOrderDto, UpdatePharmacyOrderStatusDto } from './dto/pharmacy-order.dto';

@Injectable()
export class PharmacyOrdersService {
    constructor(private prisma: PrismaService) { }

    async create(tenantId: string, prescribedById: string, dto: CreatePharmacyOrderDto) {
        // Verify medication exists and has enough stock (optional at prescription stage, but recommended)
        const medication = await this.prisma.medication.findFirst({
            where: { id: dto.medicationId, tenantId },
        });

        if (!medication) {
            throw new NotFoundException('Medication not found');
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

            // Create a PENDING payment record
            const amountCharged = Number(order.medication.unitPrice) * order.quantity;
            await tx.payments.create({
                data: {
                    visitId: order.visitId,
                    amountCharged,
                    amountPaid: 0,
                    method: 'CASH', // Default, can be changed during payment
                    serviceType: 'PHARMACY',
                    status: 'PENDING',
                    pharmacyOrderId: order.id,
                    reason: `Prescription: ${order.medication.name} (${order.quantity} units)`,
                },
            });

            return order;
        });
    }

    async findAll(tenantId: string, status?: string) {
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

    async findByVisit(tenantId: string, visitId: string) {
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

    async updateStatus(tenantId: string, id: string, userId: string, dto: UpdatePharmacyOrderStatusDto) {
        const order = await this.prisma.pharmacyOrder.findFirst({
            where: { id, visit: { tenantId } },
            include: { medication: true },
        });

        if (!order) throw new NotFoundException('Pharmacy order not found');

        // Only handle PENDING -> DISPENSED stock reduction
        if (dto.status === 'DISPENSED' && order.status === 'PENDING') {
            if (order.medication.stockBalance < order.quantity) {
                throw new BadRequestException('Insufficient stock balance');
            }

            return this.prisma.$transaction(async (tx) => {
                // Reduce stock
                await tx.medication.update({
                    where: { id: order.medicationId },
                    data: {
                        stockBalance: { decrement: order.quantity },
                    },
                });

                // Update order
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
}
