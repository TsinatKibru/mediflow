import { ScheduleService } from './schedule.service';
export declare class ScheduleController {
    private readonly scheduleService;
    constructor(scheduleService: ScheduleService);
    getAvailability(doctorId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        tenantId: string;
        doctorId: string;
        startTime: string;
        endTime: string;
        dayOfWeek: number;
    }[]>;
    updateAvailability(doctorId: string, availabilities: any[], req: any): Promise<any[]>;
}
