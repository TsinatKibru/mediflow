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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async registerTenant(dto) {
        const { tenantName, tenantSlug, adminEmail, adminPassword } = dto;
        const existingTenant = await this.prisma.tenant.findUnique({
            where: { subdomain: tenantSlug },
        });
        if (existingTenant) {
            throw new common_1.ConflictException('Subdomain already in use');
        }
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const result = await this.prisma.$transaction(async (tx) => {
            const tenant = await tx.tenant.create({
                data: {
                    name: tenantName,
                    subdomain: tenantSlug,
                },
            });
            const user = await tx.user.create({
                data: {
                    email: adminEmail,
                    password: hashedPassword,
                    firstName: 'Admin',
                    lastName: 'Owner',
                    role: client_1.Role.HOSPITAL_ADMIN,
                    tenantId: tenant.id,
                },
            });
            return { tenant, user };
        });
        const payload = {
            sub: result.user.id,
            email: result.user.email,
            tenantId: result.tenant.id,
            role: result.user.role,
            departmentId: result.user.departmentId,
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: result.user.id,
                email: result.user.email,
                firstName: result.user.firstName,
                lastName: result.user.lastName,
                role: result.user.role,
                departmentId: result.user.departmentId,
            },
            tenant: {
                id: result.tenant.id,
                name: result.tenant.name,
                subdomain: result.tenant.subdomain,
            },
        };
    }
    async login(dto) {
        const { email, password, tenantSlug } = dto;
        const tenant = await this.prisma.tenant.findUnique({
            where: { subdomain: tenantSlug },
        });
        if (!tenant) {
            throw new common_1.UnauthorizedException('Invalid credentials or tenant');
        }
        const user = await this.prisma.user.findFirst({
            where: {
                email,
                tenantId: tenant.id,
            },
        });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new common_1.UnauthorizedException('Invalid credentials or tenant');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            tenantId: tenant.id,
            role: user.role,
            departmentId: user.departmentId,
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                departmentId: user.departmentId,
            },
            tenant: {
                id: tenant.id,
                name: tenant.name,
                subdomain: tenant.subdomain,
            },
        };
    }
    async updateProfile(userId, dto) {
        const data = {};
        if (dto.firstName)
            data.firstName = dto.firstName;
        if (dto.lastName)
            data.lastName = dto.lastName;
        if (dto.password) {
            data.password = await bcrypt.hash(dto.password, 10);
        }
        if (dto.departmentId !== undefined) {
            data.departmentId = dto.departmentId || null;
        }
        const user = await this.prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                tenantId: true,
                departmentId: true,
            }
        });
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map