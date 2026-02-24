import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Controller('tenants')
@UseGuards(JwtAuthGuard, TenantGuard)
export class TenantsController {
    constructor(private readonly tenantsService: TenantsService) { }

    @Get('current')
    async getCurrentTenant(@Req() req) {
        return this.tenantsService.getCurrentTenant(req.user.tenantId);
    }

    @Patch('current')
    @UseGuards(RolesGuard)
    @Roles(Role.HOSPITAL_ADMIN, Role.SUPER_ADMIN)
    async updateTenant(@Req() req, @Body() dto: UpdateTenantDto) {
        return this.tenantsService.updateTenant(req.user.tenantId, dto);
    }
}
