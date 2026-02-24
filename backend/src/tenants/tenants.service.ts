import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsService {
    constructor(private prisma: PrismaService) { }

    async getCurrentTenant(tenantId: string) {
        return this.prisma.tenant.findUnique({
            where: { id: tenantId }
        });
    }

    async updateTenant(tenantId: string, dto: UpdateTenantDto) {
        return this.prisma.tenant.update({
            where: { id: tenantId },
            data: dto
        });
    }
}
