import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
export declare class AppointmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createAppointmentDto: CreateAppointmentDto, tenantId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        startTime: Date;
        endTime: Date;
        reason: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        doctorId: string | null;
        tenantId: string;
        visitId: string | null;
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
        status: import(".prisma/client").$Enums.AppointmentStatus;
        startTime: Date;
        endTime: Date;
        reason: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        doctorId: string | null;
        tenantId: string;
        visitId: string | null;
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
        status: import(".prisma/client").$Enums.AppointmentStatus;
        startTime: Date;
        endTime: Date;
        reason: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        doctorId: string | null;
        tenantId: string;
        visitId: string | null;
    }>;
    update(id: string, updateAppointmentDto: UpdateAppointmentDto, tenantId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        startTime: Date;
        endTime: Date;
        reason: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        doctorId: string | null;
        tenantId: string;
        visitId: string | null;
    }>;
    checkIn(id: string, departmentId: string, tenantId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.VisitStatus;
        reason: string | null;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        doctorId: string | null;
        tenantId: string;
        priority: import(".prisma/client").$Enums.Priority;
        departmentId: string;
        nurseId: string | null;
    }>;
    remove(id: string, tenantId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        startTime: Date;
        endTime: Date;
        reason: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        patientId: string;
        doctorId: string | null;
        tenantId: string;
        visitId: string | null;
    }>;
    getDoctors(tenantId: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
    }[]>;
    private isDoctorAvailable;
    private checkForOverlap;
}
