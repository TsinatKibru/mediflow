import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TenantsModule } from './tenants/tenants.module';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { VisitsModule } from './visits/visits.module';
import { DepartmentsModule } from './departments/departments.module';
import { PaymentsModule } from './payments/payments.module';
import { InsurancePoliciesModule } from './insurance-policies/insurance-policies.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ScheduleModule } from './schedule/schedule.module';
import { LabOrdersModule } from './lab-orders/lab-orders.module';
import { MedicationsModule } from './medications/medications.module';
import { PharmacyOrdersModule } from './pharmacy-orders/pharmacy-orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    TenantsModule,
    AuthModule,
    PatientsModule,
    VisitsModule,
    DepartmentsModule,
    PaymentsModule,
    InsurancePoliciesModule,
    AppointmentsModule,
    ScheduleModule,
    LabOrdersModule,
    MedicationsModule,
    PharmacyOrdersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
