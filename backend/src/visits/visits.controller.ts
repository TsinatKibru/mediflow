import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, Query } from '@nestjs/common';
import { VisitsService } from './visits.service';
import { CreateVisitDto, UpdateVitalsDto, UpdateConsultationDto } from './dto/visit.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';

@Controller('visits')
@UseGuards(JwtAuthGuard, TenantGuard)
export class VisitsController {
    constructor(private readonly visitsService: VisitsService) { }

    @Post()
    create(@Req() req: any, @Body() createVisitDto: CreateVisitDto) {
        return this.visitsService.create(req.user.tenantId, createVisitDto);
    }

    @Get()
    findAll(
        @Req() req: any,
        @Query('skip') skip?: string,
        @Query('take') take?: string,
        @Query('search') search?: string,
        @Query('departmentId') departmentId?: string,
        @Query('status') status?: string,
        @Query('paymentStatus') paymentStatus?: string,
    ) {
        return this.visitsService.findAll(
            req.user.tenantId,
            {
                skip: skip ? parseInt(skip) : undefined,
                take: take ? parseInt(take) : undefined,
                search,
                departmentId,
                status,
                paymentStatus,
                userRole: req.user.role,
                userDepartmentId: req.user.departmentId,
            }
        );
    }

    @Get('patient/:patientId')
    findByPatient(@Req() req: any, @Param('patientId') patientId: string) {
        return this.visitsService.findByPatient(req.user.tenantId, patientId);
    }

    @Get(':id')
    findOne(@Req() req: any, @Param('id') id: string) {
        return this.visitsService.findOne(req.user.tenantId, id);
    }

    @Patch(':id/triage')
    updateVitals(
        @Req() req: any,
        @Param('id') id: string,
        @Body() updateVitalsDto: UpdateVitalsDto,
    ) {
        return this.visitsService.updateVitals(
            req.user.tenantId,
            id,
            req.user.userId,
            updateVitalsDto,
        );
    }

    @Patch(':id/consultation')
    updateConsultation(
        @Req() req: any,
        @Param('id') id: string,
        @Body() updateConsultationDto: UpdateConsultationDto,
    ) {
        return this.visitsService.updateConsultation(
            req.user.tenantId,
            id,
            req.user.userId,
            updateConsultationDto,
        );
    }
}
