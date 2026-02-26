import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async registerTenant(dto: RegisterTenantDto) {
        const { tenantName, tenantSlug, adminEmail, adminPassword } = dto;

        // Check if subdomain exists
        const existingTenant = await this.prisma.tenant.findUnique({
            where: { subdomain: tenantSlug },
        });
        if (existingTenant) {
            throw new ConflictException('Subdomain already in use');
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Transactional creation
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
                    role: Role.HOSPITAL_ADMIN,
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
    } // This closing brace was missing for registerTenant
    async login(dto: LoginDto) {
        const { email, password, tenantSlug } = dto;

        // Find tenant first
        const tenant = await this.prisma.tenant.findUnique({
            where: { subdomain: tenantSlug },
        });

        if (!tenant) {
            throw new UnauthorizedException('Invalid credentials or tenant');
        }

        // Find user within that tenant
        const user = await this.prisma.user.findFirst({
            where: {
                email,
                tenantId: tenant.id,
            },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials or tenant');
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

    async updateProfile(userId: string, dto: UpdateProfileDto) {
        const data: any = {};
        if (dto.firstName) data.firstName = dto.firstName;
        if (dto.lastName) data.lastName = dto.lastName;
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
}
