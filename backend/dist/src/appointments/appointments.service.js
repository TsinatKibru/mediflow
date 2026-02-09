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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AppointmentsService = class AppointmentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createAppointmentDto, tenantId) {
        const { startTime, endTime, doctorId } = createAppointmentDto;
        if (new Date(startTime) >= new Date(endTime)) {
            throw new common_1.BadRequestException('End time must be after start time');
        }
        if (doctorId) {
            const hasOverlap = await this.checkForOverlap(doctorId, startTime, endTime, tenantId);
            if (hasOverlap) {
                throw new common_1.BadRequestException('The selected time slot is already booked for this doctor.');
            }
        }
        return this.prisma.appointment.create({
            data: {
                ...createAppointmentDto,
                tenantId,
            },
        });
    }
    async findAll(tenantId, doctorId, startDate, endDate) {
        const where = { tenantId };
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
    async findOne(id, tenantId) {
        const appointment = await this.prisma.appointment.findFirst({
            where: { id, tenantId },
            include: {
                patient: true,
                doctor: true,
            },
        });
        if (!appointment) {
            throw new common_1.NotFoundException(`Appointment with ID ${id} not found`);
        }
        return appointment;
    }
    async update(id, updateAppointmentDto, tenantId) {
        const appointment = await this.findOne(id, tenantId);
        const startTime = updateAppointmentDto.startTime || appointment.startTime.toISOString();
        const endTime = updateAppointmentDto.endTime || appointment.endTime.toISOString();
        if (new Date(startTime) >= new Date(endTime)) {
            throw new common_1.BadRequestException('End time must be after start time');
        }
        const doctorId = updateAppointmentDto.doctorId || appointment.doctorId;
        if (doctorId && (updateAppointmentDto.startTime || updateAppointmentDto.endTime || updateAppointmentDto.doctorId)) {
            const hasOverlap = await this.checkForOverlap(doctorId, startTime, endTime, tenantId, id);
            if (hasOverlap) {
                throw new common_1.BadRequestException('The selected time slot is already booked for this doctor.');
            }
        }
        return this.prisma.appointment.update({
            where: { id },
            data: updateAppointmentDto,
        });
    }
    async remove(id, tenantId) {
        await this.findOne(id, tenantId);
        return this.prisma.appointment.delete({
            where: { id },
        });
    }
    async getDoctors(tenantId) {
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
    async checkForOverlap(doctorId, start, end, tenantId, excludeId) {
        const count = await this.prisma.appointment.count({
            where: {
                tenantId,
                doctorId,
                id: excludeId ? { not: excludeId } : undefined,
                status: { not: 'CANCELLED' },
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
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map