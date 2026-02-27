import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(createAppointmentDto: CreateAppointmentDto, req: any): Promise<{
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
    findAll(req: any, doctorId?: string, start?: string, end?: string): Promise<({
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
    getDoctors(req: any): Promise<{
        id: string;
        firstName: string;
        lastName: string;
    }[]>;
    findOne(id: string, req: any): Promise<{
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
            isActive: boolean;
            tenantId: string;
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            departmentId: string | null;
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
    update(id: string, updateAppointmentDto: UpdateAppointmentDto, req: any): Promise<{
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
    checkIn(id: string, departmentId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        departmentId: string;
        status: import(".prisma/client").$Enums.VisitStatus;
        priority: import(".prisma/client").$Enums.Priority;
        reason: string | null;
        patientId: string;
        doctorId: string | null;
        nurseId: string | null;
    }>;
    remove(id: string, req: any): Promise<{
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
}
