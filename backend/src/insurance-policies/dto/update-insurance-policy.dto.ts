import { PartialType } from '@nestjs/mapped-types';
import { CreateInsurancePolicyDto } from './create-insurance-policy.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateInsurancePolicyDto extends PartialType(CreateInsurancePolicyDto) {
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
