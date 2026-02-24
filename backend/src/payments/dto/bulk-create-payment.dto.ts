import { IsArray, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePaymentDto } from './create-payment.dto';

export class BulkCreatePaymentDto {
    @IsUUID()
    visitId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreatePaymentDto)
    payments: CreatePaymentDto[];
}
