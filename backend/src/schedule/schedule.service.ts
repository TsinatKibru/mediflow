import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScheduleService {
    constructor(private prisma: PrismaService) { }

    async getDoctorAvailability(doctorId: string, tenantId: string) {
        return this.prisma.doctorAvailability.findMany({
            where: { doctorId, tenantId },
            orderBy: { dayOfWeek: 'asc' },
        });
    }

    async updateAvailability(doctorId: string, tenantId: string, availabilities: any[]) {
        // We update them by iterating. For simplicity, we can delete and recreate or upsert.
        // Upserting by (doctorId, dayOfWeek, tenantId) is better since we have a unique constraint.

        const results: any[] = [];
        for (const avail of availabilities) {
            const result = await this.prisma.doctorAvailability.upsert({
                where: {
                    doctorId_dayOfWeek_tenantId: {
                        doctorId,
                        dayOfWeek: avail.dayOfWeek,
                        tenantId,
                    },
                },
                update: {
                    startTime: avail.startTime,
                    endTime: avail.endTime,
                    isActive: avail.isActive ?? true,
                },
                create: {
                    doctorId,
                    dayOfWeek: avail.dayOfWeek,
                    tenantId,
                    startTime: avail.startTime,
                    endTime: avail.endTime,
                    isActive: avail.isActive ?? true,
                },
            });
            results.push(result);
        }
        return results;
    }
}
