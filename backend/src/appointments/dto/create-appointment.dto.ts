import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
    @IsNotEmpty()
    @IsUUID()
    patientId: string;

    @IsOptional()
    @IsUUID()
    doctorId?: string; // Optional if not assigned immediately

    @IsNotEmpty()
    @IsDateString()
    startTime: string;

    @IsNotEmpty()
    @IsDateString()
    endTime: string;

    @IsOptional()
    @IsString()
    localStartTimeStr?: string;

    @IsOptional()
    @IsString()
    localEndTimeStr?: string;

    @IsOptional()
    localDayOfWeek?: number;

    @IsOptional()
    @IsString()
    reason?: string;

    @IsOptional()
    @IsString()
    notes?: string;
}
