import { Module } from '@nestjs/common';
import { PharmacyOrdersService } from './pharmacy-orders.service';
import { PharmacyOrdersController } from './pharmacy-orders.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [PharmacyOrdersController],
    providers: [PharmacyOrdersService],
})
export class PharmacyOrdersModule { }
