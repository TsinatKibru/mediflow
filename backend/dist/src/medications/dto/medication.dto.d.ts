export declare class CreateMedicationDto {
    name: string;
    genericName?: string;
    dosageForm: string;
    strength: string;
    stockBalance: number;
    unitPrice: number;
}
export declare class UpdateMedicationDto {
    name?: string;
    genericName?: string;
    dosageForm?: string;
    strength?: string;
    stockBalance?: number;
    unitPrice?: number;
}
