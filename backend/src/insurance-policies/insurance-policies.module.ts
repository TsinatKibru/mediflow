import { Module } from '@nestjs/common';
import { InsurancePoliciesService } from './insurance-policies.service';
import { InsurancePoliciesController } from './insurance-policies.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [InsurancePoliciesService],
  controllers: [InsurancePoliciesController]
})
export class InsurancePoliciesModule { }
