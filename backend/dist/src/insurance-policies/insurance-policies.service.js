"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsurancePoliciesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InsurancePoliciesService = class InsurancePoliciesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createInsurancePolicyDto, tenantId) {
        return this.prisma.insurancePolicy.create({
            data: {
                ...createInsurancePolicyDto,
                tenantId,
            },
        });
    }
    async findAllByPatient(patientId, tenantId) {
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
    async findOne(id, tenantId) {
        const policy = await this.prisma.insurancePolicy.findFirst({
            where: { id, tenantId },
        });
        if (!policy) {
            throw new common_1.NotFoundException(`Insurance Policy with ID ${id} not found`);
        }
        return policy;
    }
    async update(id, updateInsurancePolicyDto, tenantId) {
        await this.findOne(id, tenantId);
        return this.prisma.insurancePolicy.update({
            where: { id },
            data: updateInsurancePolicyDto,
        });
    }
    async remove(id, tenantId) {
        await this.findOne(id, tenantId);
        return this.prisma.insurancePolicy.delete({
            where: { id },
        });
    }
};
exports.InsurancePoliciesService = InsurancePoliciesService;
exports.InsurancePoliciesService = InsurancePoliciesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InsurancePoliciesService);
//# sourceMappingURL=insurance-policies.service.js.map