export declare class CreateVisitDto {
    patientId: string;
    departmentId: string;
    reason?: string;
}
export declare class UpdateVitalsDto {
    temperature: number;
    bpSystolic?: number;
    bpDiastolic?: number;
    heartRate: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    weight?: number;
    height?: number;
}
export declare class UpdateConsultationDto {
    notes: string;
    prescription?: string;
    diagnosis?: string;
}
