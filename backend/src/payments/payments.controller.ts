import { Controller, Post, Get, Body, Param, UseGuards, Request, Patch, Delete, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { VoidPaymentDto } from './dto/void-payment.dto';
import { BulkCreatePaymentDto } from './dto/bulk-create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard, TenantGuard)
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Get()
    findAll(@Request() req, @Query('skip') skip?: string, @Query('take') take?: string) {
        return this.paymentsService.findAll(
            req.user.tenantId,
            skip ? parseInt(skip) : undefined,
            take ? parseInt(take) : undefined
        );
    }

    @Post()
    create(@Body() createPaymentDto: CreatePaymentDto, @Request() req) {
        return this.paymentsService.create(createPaymentDto, req.user.id);
    }

    @Get('visit/:visitId')
    findByVisit(@Param('visitId') visitId: string) {
        return this.paymentsService.findByVisit(visitId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
        return this.paymentsService.update(id, updatePaymentDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.paymentsService.remove(id);
    }

    @Post('bulk')
    bulkCreate(@Body() bulkCreatePaymentDto: BulkCreatePaymentDto, @Request() req) {
        return this.paymentsService.bulkCreate(bulkCreatePaymentDto, req.user.id);
    }

    @Post(':id/void')
    void(@Param('id') id: string, @Body() voidPaymentDto: VoidPaymentDto, @Request() req) {
        return this.paymentsService.void(id, voidPaymentDto, req.user.id);
    }

    @Patch('coverage/:visitId/status')
    updateClaimStatus(@Param('visitId') visitId: string, @Body('status') status: string, @Request() req) {
        return this.paymentsService.updateClaimStatus(visitId, status, req.user.id);
    }
}
