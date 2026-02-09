import { CreateInsurancePolicyDto } from './create-insurance-policy.dto';
declare const UpdateInsurancePolicyDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateInsurancePolicyDto>>;
export declare class UpdateInsurancePolicyDto extends UpdateInsurancePolicyDto_base {
    isActive?: boolean;
}
export {};
