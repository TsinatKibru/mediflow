export declare class CreateAppointmentDto {
    patientId: string;
    doctorId?: string;
    startTime: string;
    endTime: string;
    localStartTimeStr?: string;
    localEndTimeStr?: string;
    localDayOfWeek?: number;
    reason?: string;
    notes?: string;
}
