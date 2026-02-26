import { Module } from '@nestjs/common';
import { MedicationsService } from './medications.service';
import { MedicationsController } from './medications.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    // PrismaService is likely and hopefully inside a PrismaModule, 
    // but if not imported directly, we might need a centralized PrismaModule.
    // Based on previous logs, PrismaService exists.
    controllers: [MedicationsController],
    providers: [MedicationsService],
})
export class MedicationsModule { }
