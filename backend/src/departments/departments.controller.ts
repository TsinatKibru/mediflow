import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';

@Controller('departments')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class DepartmentsController {
    constructor(private readonly departmentsService: DepartmentsService) { }

    @Get()
    findAll(@Req() req) {
        return this.departmentsService.findAll(req.user.tenantId);
    }

    @Get(':id')
    findOne(@Req() req, @Param('id') id: string) {
        return this.departmentsService.findOne(req.user.tenantId, id);
    }

    @Post()
    @Roles('SUPER_ADMIN', 'HOSPITAL_ADMIN')
    create(@Req() req, @Body() createDepartmentDto: CreateDepartmentDto) {
        return this.departmentsService.create(req.user.tenantId, createDepartmentDto);
    }

    @Patch(':id')
    @Roles('SUPER_ADMIN', 'HOSPITAL_ADMIN')
    update(@Req() req, @Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
        return this.departmentsService.update(req.user.tenantId, id, updateDepartmentDto);
    }

    @Delete(':id')
    @Roles('SUPER_ADMIN', 'HOSPITAL_ADMIN')
    remove(@Req() req, @Param('id') id: string) {
        return this.departmentsService.remove(req.user.tenantId, id);
    }
}
