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
    Query,
} from '@nestjs/common';
import { InsurancePoliciesService } from './insurance-policies.service';
import { CreateInsurancePolicyDto } from './dto/create-insurance-policy.dto';
import { UpdateInsurancePolicyDto } from './dto/update-insurance-policy.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';

@Controller('insurance-policies')
@UseGuards(JwtAuthGuard, TenantGuard)
export class InsurancePoliciesController {
    constructor(private readonly insurancePoliciesService: InsurancePoliciesService) { }

    @Post()
    create(@Req() req, @Body() createInsurancePolicyDto: CreateInsurancePolicyDto) {
        return this.insurancePoliciesService.create(createInsurancePolicyDto, req.user.tenantId);
    }

    @Get()
    findAll(@Req() req, @Query('patientId') patientId: string) {
        if (patientId) {
            return this.insurancePoliciesService.findAllByPatient(patientId, req.user.tenantId);
        }
        // Add a general findAll if needed, but for now we focus on patient-specific lookup
        return [];
    }

    @Get(':id')
    findOne(@Req() req, @Param('id') id: string) {
        return this.insurancePoliciesService.findOne(id, req.user.tenantId);
    }

    @Patch(':id')
    update(
        @Req() req,
        @Param('id') id: string,
        @Body() updateInsurancePolicyDto: UpdateInsurancePolicyDto,
    ) {
        return this.insurancePoliciesService.update(id, updateInsurancePolicyDto, req.user.tenantId);
    }

    @Delete(':id')
    remove(@Req() req, @Param('id') id: string) {
        return this.insurancePoliciesService.remove(id, req.user.tenantId);
    }
}
