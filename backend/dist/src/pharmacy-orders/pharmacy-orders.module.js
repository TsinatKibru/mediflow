"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyOrdersModule = void 0;
const common_1 = require("@nestjs/common");
const pharmacy_orders_service_1 = require("./pharmacy-orders.service");
const pharmacy_orders_controller_1 = require("./pharmacy-orders.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let PharmacyOrdersModule = class PharmacyOrdersModule {
};
exports.PharmacyOrdersModule = PharmacyOrdersModule;
exports.PharmacyOrdersModule = PharmacyOrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [pharmacy_orders_controller_1.PharmacyOrdersController],
        providers: [pharmacy_orders_service_1.PharmacyOrdersService],
    })
], PharmacyOrdersModule);
//# sourceMappingURL=pharmacy-orders.module.js.map