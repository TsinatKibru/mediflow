import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';

@Controller('departments')
@UseGuards(JwtAuthGuard, TenantGuard)
export class DepartmentsController {
    constructor(private readonly departmentsService: DepartmentsService) { }

    @Get()
    findAll(@Req() req) {
        return this.departmentsService.findAll(req.user.tenantId);
    }
}
