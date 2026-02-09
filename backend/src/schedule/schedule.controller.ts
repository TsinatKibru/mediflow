import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';

@Controller('schedule')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) { }

    @Get(':doctorId')
    async getAvailability(@Param('doctorId') doctorId: string, @Request() req: any) {
        return this.scheduleService.getDoctorAvailability(doctorId, req.user.tenantId);
    }

    @Post(':doctorId')
    async updateAvailability(
        @Param('doctorId') doctorId: string,
        @Body() availabilities: any[],
        @Request() req: any,
    ) {
        return this.scheduleService.updateAvailability(doctorId, req.user.tenantId, availabilities);
    }
}
