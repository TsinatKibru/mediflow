export declare enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER"
}
export declare class CreatePatientDto {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: Gender;
    phone?: string;
    email?: string;
    address?: string;
}
export declare class UpdatePatientDto extends CreatePatientDto {
}
