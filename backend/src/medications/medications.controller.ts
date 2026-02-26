import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { MedicationsService } from './medications.service';
import { CreateMedicationDto, UpdateMedicationDto } from './dto/medication.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';

@Controller('medications')
@UseGuards(JwtAuthGuard, TenantGuard)
export class MedicationsController {
    constructor(private readonly medicationsService: MedicationsService) { }

    @Post()
    create(@Req() req: any, @Body() createMedicationDto: CreateMedicationDto) {
        return this.medicationsService.create(req.user.tenantId, createMedicationDto);
    }

    @Get()
    findAll(@Req() req: any, @Query('search') search?: string) {
        return this.medicationsService.findAll(req.user.tenantId, search);
    }

    @Get(':id')
    findOne(@Req() req: any, @Param('id') id: string) {
        return this.medicationsService.findOne(req.user.tenantId, id);
    }

    @Patch(':id')
    update(@Req() req: any, @Param('id') id: string, @Body() updateMedicationDto: UpdateMedicationDto) {
        return this.medicationsService.update(req.user.tenantId, id, updateMedicationDto);
    }

    @Delete(':id')
    remove(@Req() req: any, @Param('id') id: string) {
        return this.medicationsService.remove(req.user.tenantId, id);
    }
}
