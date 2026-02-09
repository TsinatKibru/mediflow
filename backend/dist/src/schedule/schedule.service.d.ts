import { PrismaService } from '../prisma/prisma.service';
export declare class ScheduleService {
    private prisma;
    constructor(prisma: PrismaService);
    getDoctorAvailability(doctorId: string, tenantId: string): Promise<{
        id: string;
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        isActive: boolean;
        doctorId: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    updateAvailability(doctorId: string, tenantId: string, availabilities: any[]): Promise<any[]>;
}
