import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, Query } from '@nestjs/common';
import { PharmacyOrdersService } from './pharmacy-orders.service';
import { CreatePharmacyOrderDto, UpdatePharmacyOrderStatusDto } from './dto/pharmacy-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';

@Controller('pharmacy-orders')
@UseGuards(JwtAuthGuard, TenantGuard)
export class PharmacyOrdersController {
    constructor(private readonly pharmacyOrdersService: PharmacyOrdersService) { }

    @Post()
    create(@Req() req: any, @Body() createPharmacyOrderDto: CreatePharmacyOrderDto) {
        return this.pharmacyOrdersService.create(req.user.tenantId, req.user.userId, createPharmacyOrderDto);
    }

    @Get()
    findAll(@Req() req: any, @Query('status') status?: string) {
        return this.pharmacyOrdersService.findAll(req.user.tenantId, status);
    }

    @Get('visit/:visitId')
    findByVisit(@Req() req: any, @Param('visitId') visitId: string) {
        return this.pharmacyOrdersService.findByVisit(req.user.tenantId, visitId);
    }

    @Patch(':id/status')
    updateStatus(@Req() req: any, @Param('id') id: string, @Body() dto: UpdatePharmacyOrderStatusDto) {
        return this.pharmacyOrdersService.updateStatus(req.user.tenantId, id, req.user.userId, dto);
    }
}
