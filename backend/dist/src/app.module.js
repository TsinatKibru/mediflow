"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const tenants_module_1 = require("./tenants/tenants.module");
const auth_module_1 = require("./auth/auth.module");
const patients_module_1 = require("./patients/patients.module");
const visits_module_1 = require("./visits/visits.module");
const departments_module_1 = require("./departments/departments.module");
const payments_module_1 = require("./payments/payments.module");
const insurance_policies_module_1 = require("./insurance-policies/insurance-policies.module");
const appointments_module_1 = require("./appointments/appointments.module");
const schedule_module_1 = require("./schedule/schedule.module");
const lab_orders_module_1 = require("./lab-orders/lab-orders.module");
const medications_module_1 = require("./medications/medications.module");
const pharmacy_orders_module_1 = require("./pharmacy-orders/pharmacy-orders.module");
const service_catalog_module_1 = require("./service-catalog/service-catalog.module");
const users_module_1 = require("./users/users.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            tenants_module_1.TenantsModule,
            auth_module_1.AuthModule,
            patients_module_1.PatientsModule,
            visits_module_1.VisitsModule,
            departments_module_1.DepartmentsModule,
            payments_module_1.PaymentsModule,
            insurance_policies_module_1.InsurancePoliciesModule,
            appointments_module_1.AppointmentsModule,
            schedule_module_1.ScheduleModule,
            lab_orders_module_1.LabOrdersModule,
            medications_module_1.MedicationsModule,
            pharmacy_orders_module_1.PharmacyOrdersModule,
            service_catalog_module_1.ServiceCatalogModule,
            users_module_1.UsersModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map