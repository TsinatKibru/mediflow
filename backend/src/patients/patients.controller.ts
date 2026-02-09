import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';

@Controller('patients')
@UseGuards(JwtAuthGuard, TenantGuard)
export class PatientsController {
    constructor(private readonly patientsService: PatientsService) { }

    @Post()
    create(@Req() req, @Body() createPatientDto: CreatePatientDto) {
        return this.patientsService.create(req.user.tenantId, createPatientDto);
    }

    @Get()
    findAll(@Req() req) {
        return this.patientsService.findAll(req.user.tenantId);
    }

    @Get(':id')
    findOne(@Req() req, @Param('id') id: string) {
        return this.patientsService.findOne(req.user.tenantId, id);
    }

    @Get(':id/visits')
    findPatientVisits(@Req() req, @Param('id') id: string) {
        return this.patientsService.findPatientVisits(req.user.tenantId, id);
    }

    @Patch(':id')
    update(
        @Req() req,
        @Param('id') id: string,
        @Body() updatePatientDto: UpdatePatientDto,
    ) {
        return this.patientsService.update(
            req.user.tenantId,
            id,
            updatePatientDto,
        );
    }

    @Delete(':id')
    remove(@Req() req, @Param('id') id: string) {
        return this.patientsService.remove(req.user.tenantId, id);
    }
}
