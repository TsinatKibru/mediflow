import { PrismaService } from '../prisma/prisma.service';
export declare class ScheduleService {
    private prisma;
    constructor(prisma: PrismaService);
    getDoctorAvailability(doctorId: string, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        isActive: boolean;
        doctorId: string;
        startTime: string;
        endTime: string;
        dayOfWeek: number;
    }[]>;
    updateAvailability(doctorId: string, tenantId: string, availabilities: any[]): Promise<any[]>;
}
