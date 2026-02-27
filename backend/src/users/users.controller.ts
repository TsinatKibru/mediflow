import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { Role } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard, TenantGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    async create(@Body() createUserDto: CreateUserDto, @Request() req) {
        if (req.user.role !== Role.HOSPITAL_ADMIN && req.user.role !== Role.SUPER_ADMIN) {
            throw new ForbiddenException('Only administrators can create users');
        }
        return this.usersService.create(createUserDto, req.user.tenantId);
    }

    @Get()
    async findAll(@Request() req) {
        return this.usersService.findAll(req.user.tenantId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req) {
        return this.usersService.findOne(id, req.user.tenantId);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: any, @Request() req) {
        // Only allow admins to update other users, or users to update themselves
        if (req.user.role !== Role.HOSPITAL_ADMIN && req.user.role !== Role.SUPER_ADMIN && req.user.id !== id) {
            throw new ForbiddenException('You do not have permission to update this user');
        }
        return this.usersService.update(id, dto, req.user.tenantId);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req) {
        if (req.user.role !== Role.HOSPITAL_ADMIN && req.user.role !== Role.SUPER_ADMIN) {
            throw new ForbiddenException('Only administrators can deactivate users');
        }
        return this.usersService.remove(id, req.user.tenantId);
    }
}
