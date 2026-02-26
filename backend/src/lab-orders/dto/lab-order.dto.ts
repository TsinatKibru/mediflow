import { IsString, IsOptional, IsNotEmpty, IsEnum } from 'class-validator';

export class CreateLabOrderDto {
    @IsString()
    @IsNotEmpty()
    visitId: string;

    @IsString()
    @IsNotEmpty()
    testName: string;

    @IsString()
    @IsOptional()
    instructions?: string;
}

export class UpdateLabOrderDto {
    @IsString()
    @IsOptional()
    status?: string;

    @IsString()
    @IsOptional()
    result?: string;
}
