import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInsurancePolicyDto } from './dto/create-insurance-policy.dto';
import { UpdateInsurancePolicyDto } from './dto/update-insurance-policy.dto';

@Injectable()
export class InsurancePoliciesService {
    constructor(private prisma: PrismaService) { }

    async create(createInsurancePolicyDto: CreateInsurancePolicyDto, tenantId: string) {
        return this.prisma.insurancePolicy.create({
            data: {
                ...createInsurancePolicyDto,
                tenantId,
            },
        });
    }

    async findAllByPatient(patientId: string, tenantId: string) {
        return this.prisma.insurancePolicy.findMany({
            where: {
                patientId,
                tenantId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findOne(id: string, tenantId: string) {
        const policy = await this.prisma.insurancePolicy.findFirst({
            where: { id, tenantId },
        });
        if (!policy) {
            throw new NotFoundException(`Insurance Policy with ID ${id} not found`);
        }
        return policy;
    }

    async update(id: string, updateInsurancePolicyDto: UpdateInsurancePolicyDto, tenantId: string) {
        await this.findOne(id, tenantId); // Check existence
        return this.prisma.insurancePolicy.update({
            where: { id },
            data: updateInsurancePolicyDto,
        });
    }

    async remove(id: string, tenantId: string) {
        await this.findOne(id, tenantId); // Check existence
        return this.prisma.insurancePolicy.delete({
            where: { id },
        });
    }
}
