import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceCatalogDto, UpdateServiceCatalogDto } from './dto/service-catalog.dto';

@Injectable()
export class ServiceCatalogService {
    constructor(private prisma: PrismaService) { }

    async create(tenantId: string, dto: CreateServiceCatalogDto) {
        return this.prisma.serviceCatalog.create({
            data: {
                ...dto,
                tenantId,
            },
        });
    }

    async findAll(tenantId: string, category?: string) {
        return this.prisma.serviceCatalog.findMany({
            where: {
                tenantId,
                ...(category ? { category: category as any } : {}),
            },
            orderBy: { name: 'asc' },
        });
    }

    async findOne(tenantId: string, id: string) {
        const item = await this.prisma.serviceCatalog.findFirst({
            where: { id, tenantId },
        });

        if (!item) throw new NotFoundException('Service catalog item not found');
        return item;
    }

    async update(tenantId: string, id: string, dto: UpdateServiceCatalogDto) {
        await this.findOne(tenantId, id);

        return this.prisma.serviceCatalog.update({
            where: { id },
            data: dto,
        });
    }

    async remove(tenantId: string, id: string) {
        await this.findOne(tenantId, id);

        return this.prisma.serviceCatalog.delete({
            where: { id },
        });
    }
}
