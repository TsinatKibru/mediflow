import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';

@Controller('appointments')
@UseGuards(JwtAuthGuard, TenantGuard)
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

    @Post()
    async create(@Body() createAppointmentDto: CreateAppointmentDto, @Request() req) {
        try {
            return await this.appointmentsService.create(createAppointmentDto, req.user.tenantId);
        } catch (error) {
            throw error;
        }
    }

    @Get()
    findAll(
        @Request() req,
        @Query('doctorId') doctorId?: string,
        @Query('start') start?: string,
        @Query('end') end?: string,
    ) {
        return this.appointmentsService.findAll(req.user.tenantId, doctorId, start, end);
    }

    @Get('doctors')
    getDoctors(@Request() req) {
        return this.appointmentsService.getDoctors(req.user.tenantId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.appointmentsService.findOne(id, req.user.tenantId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto, @Request() req) {
        return this.appointmentsService.update(id, updateAppointmentDto, req.user.tenantId);
    }



    @Post(':id/check-in')
    async checkIn(@Param('id') id: string, @Body('departmentId') departmentId: string, @Request() req) {
        return this.appointmentsService.checkIn(id, departmentId, req.user.tenantId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.appointmentsService.remove(id, req.user.tenantId);
    }
}
