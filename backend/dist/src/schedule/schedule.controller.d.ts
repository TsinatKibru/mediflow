import { ScheduleService } from './schedule.service';
export declare class ScheduleController {
    private readonly scheduleService;
    constructor(scheduleService: ScheduleService);
    getAvailability(doctorId: string, req: any): Promise<{
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
    updateAvailability(doctorId: string, availabilities: any[], req: any): Promise<any[]>;
}
