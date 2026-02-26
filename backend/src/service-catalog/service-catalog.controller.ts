import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ServiceCatalogService } from './service-catalog.service';
import { CreateServiceCatalogDto, UpdateServiceCatalogDto } from './dto/service-catalog.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';

@Controller('service-catalog')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ServiceCatalogController {
    constructor(private readonly serviceCatalogService: ServiceCatalogService) { }

    @Post()
    create(@Request() req, @Body() dto: CreateServiceCatalogDto) {
        return this.serviceCatalogService.create(req.user.tenantId, dto);
    }

    @Get()
    findAll(@Request() req, @Query('category') category?: string) {
        return this.serviceCatalogService.findAll(req.user.tenantId, category);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.serviceCatalogService.findOne(req.user.tenantId, id);
    }

    @Patch(':id')
    update(@Request() req, @Param('id') id: string, @Body() dto: UpdateServiceCatalogDto) {
        return this.serviceCatalogService.update(req.user.tenantId, id, dto);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.serviceCatalogService.remove(req.user.tenantId, id);
    }
}
