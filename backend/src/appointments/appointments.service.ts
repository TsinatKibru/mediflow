import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
    constructor(private prisma: PrismaService) { }

    async create(createAppointmentDto: CreateAppointmentDto, tenantId: string) {
        const { startTime, endTime, doctorId } = createAppointmentDto;

        if (new Date(startTime) >= new Date(endTime)) {
            throw new BadRequestException('End time must be after start time');
        }

        // Check for overlaps if a doctor is assigned
        if (doctorId) {
            // 1. Check working hours
            const isAvailable = await this.isDoctorAvailable(doctorId, startTime, endTime, tenantId);
            if (!isAvailable) {
                throw new BadRequestException('The selected time is outside the doctor\'s working hours.');
            }

            // 2. Check for overlaps
            const hasOverlap = await this.checkForOverlap(doctorId, startTime, endTime, tenantId);
            if (hasOverlap) {
                throw new BadRequestException('The selected time slot is already booked for this doctor.');
            }
        }

        return this.prisma.appointment.create({
            data: {
                ...createAppointmentDto,
                tenantId,
            },
        });
    }

    async findAll(tenantId: string, doctorId?: string, startDate?: string, endDate?: string) {
        const where: any = { tenantId };

        if (doctorId) {
            where.doctorId = doctorId;
        }

        if (startDate && endDate) {
            where.startTime = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }

        return this.prisma.appointment.findMany({
            where,
            include: {
                patient: {
                    select: { firstName: true, lastName: true },
                },
                doctor: {
                    select: { firstName: true, lastName: true },
                },
            },
            orderBy: {
                startTime: 'asc',
            },
        });
    }

    async findOne(id: string, tenantId: string) {
        const appointment = await this.prisma.appointment.findFirst({
            where: { id, tenantId },
            include: {
                patient: true,
                doctor: true,
            },
        });

        if (!appointment) {
            throw new NotFoundException(`Appointment with ID ${id} not found`);
        }

        return appointment;
    }

    async update(id: string, updateAppointmentDto: UpdateAppointmentDto, tenantId: string) {
        const appointment = await this.findOne(id, tenantId);

        const startTime = updateAppointmentDto.startTime || appointment.startTime.toISOString();
        const endTime = updateAppointmentDto.endTime || appointment.endTime.toISOString();

        if (new Date(startTime) >= new Date(endTime)) {
            throw new BadRequestException('End time must be after start time');
        }

        // Check overlap/availability only if time or doctor changes
        const doctorId = updateAppointmentDto.doctorId || appointment.doctorId;
        if (doctorId && (updateAppointmentDto.startTime || updateAppointmentDto.endTime || updateAppointmentDto.doctorId)) {
            // 1. Check working hours
            const isAvailable = await this.isDoctorAvailable(doctorId, startTime, endTime, tenantId);
            if (!isAvailable) {
                throw new BadRequestException('The selected time is outside the doctor\'s working hours.');
            }

            // 2. Check for overlaps
            const hasOverlap = await this.checkForOverlap(doctorId, startTime, endTime, tenantId, id);
            if (hasOverlap) {
                throw new BadRequestException('The selected time slot is already booked for this doctor.');
            }
        }

        return this.prisma.appointment.update({
            where: { id },
            data: updateAppointmentDto,
        });
    }

    async remove(id: string, tenantId: string) {
        await this.findOne(id, tenantId);
        return this.prisma.appointment.delete({
            where: { id },
        });
    }

    async getDoctors(tenantId: string) {
        return this.prisma.user.findMany({
            where: {
                tenantId,
                role: 'DOCTOR',
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
            },
        });
    }

    private async isDoctorAvailable(doctorId: string, start: string, end: string, tenantId: string): Promise<boolean> {
        const startDate = new Date(start);
        const dayOfWeek = startDate.getDay();

        const availability = await this.prisma.doctorAvailability.findFirst({
            where: {
                doctorId,
                dayOfWeek,
                tenantId,
                isActive: true,
            },
        });

        if (!availability) {
            // If no schedule is set, we could either allow or block. 
            // In a strict system, we block or assume default hours. 
            // Let's assume they must have a schedule set to be bookable.
            return false;
        }

        // Compare times as strings "HH:mm"
        const aptStartStr = startDate.toTimeString().slice(0, 5);
        const aptEndStr = new Date(end).toTimeString().slice(0, 5);

        return aptStartStr >= availability.startTime && aptEndStr <= availability.endTime;
    }

    private async checkForOverlap(doctorId: string, start: string, end: string, tenantId: string, excludeId?: string): Promise<boolean> {

        const count = await this.prisma.appointment.count({
            where: {
                tenantId,
                doctorId,
                id: excludeId ? { not: excludeId } : undefined,
                status: { not: 'CANCELLED' }, // Ignore cancelled appointments
                OR: [
                    {
                        startTime: { lt: new Date(end) },
                        endTime: { gt: new Date(start) },
                    },
                ],
            },
        });
        return count > 0;
    }
}
