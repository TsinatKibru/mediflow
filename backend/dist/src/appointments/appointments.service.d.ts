import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
export declare class AppointmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createAppointmentDto: CreateAppointmentDto, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        reason: string | null;
        patientId: string;
        doctorId: string | null;
        notes: string | null;
        visitId: string | null;
        startTime: Date;
        endTime: Date;
    }>;
    findAll(tenantId: string, doctorId?: string, startDate?: string, endDate?: string): Promise<({
        patient: {
            firstName: string;
            lastName: string;
        };
        doctor: {
            firstName: string;
            lastName: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        reason: string | null;
        patientId: string;
        doctorId: string | null;
        notes: string | null;
        visitId: string | null;
        startTime: Date;
        endTime: Date;
    })[]>;
    findOne(id: string, tenantId: string): Promise<{
        patient: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            firstName: string;
            lastName: string;
            dateOfBirth: Date;
            gender: string;
            phone: string | null;
            email: string | null;
        };
        doctor: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        reason: string | null;
        patientId: string;
        doctorId: string | null;
        notes: string | null;
        visitId: string | null;
        startTime: Date;
        endTime: Date;
    }>;
    update(id: string, updateAppointmentDto: UpdateAppointmentDto, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        reason: string | null;
        patientId: string;
        doctorId: string | null;
        notes: string | null;
        visitId: string | null;
        startTime: Date;
        endTime: Date;
    }>;
    remove(id: string, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        reason: string | null;
        patientId: string;
        doctorId: string | null;
        notes: string | null;
        visitId: string | null;
        startTime: Date;
        endTime: Date;
    }>;
    getDoctors(tenantId: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
    }[]>;
    private checkForOverlap;
}
