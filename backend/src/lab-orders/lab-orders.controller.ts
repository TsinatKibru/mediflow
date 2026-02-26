import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { LabOrdersService } from './lab-orders.service';
import { CreateLabOrderDto, UpdateLabOrderDto } from './dto/lab-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';

@Controller('lab-orders')
@UseGuards(JwtAuthGuard, TenantGuard)
export class LabOrdersController {
    constructor(private readonly labOrdersService: LabOrdersService) { }

    @Get()
    findAll(@Req() req: any, @Query('status') status?: string) {
        return this.labOrdersService.findAll(req.user.tenantId, status);
    }

    @Post()
    create(@Req() req: any, @Body() createLabOrderDto: CreateLabOrderDto) {
        return this.labOrdersService.create(req.user.tenantId, req.user.userId, createLabOrderDto);
    }

    @Get('visit/:visitId')
    findByVisit(@Req() req: any, @Param('visitId') visitId: string) {
        return this.labOrdersService.findByVisit(req.user.tenantId, visitId);
    }

    @Patch(':id')
    update(@Req() req: any, @Param('id') id: string, @Body() updateLabOrderDto: UpdateLabOrderDto) {
        return this.labOrdersService.update(req.user.tenantId, id, updateLabOrderDto);
    }

    @Delete(':id')
    remove(@Req() req: any, @Param('id') id: string) {
        return this.labOrdersService.delete(req.user.tenantId, id);
    }
}
