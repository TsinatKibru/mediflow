"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ScheduleService = class ScheduleService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDoctorAvailability(doctorId, tenantId) {
        return this.prisma.doctorAvailability.findMany({
            where: { doctorId, tenantId },
            orderBy: { dayOfWeek: 'asc' },
        });
    }
    async updateAvailability(doctorId, tenantId, availabilities) {
        const results = [];
        for (const avail of availabilities) {
            const result = await this.prisma.doctorAvailability.upsert({
                where: {
                    doctorId_dayOfWeek_tenantId: {
                        doctorId,
                        dayOfWeek: avail.dayOfWeek,
                        tenantId,
                    },
                },
                update: {
                    startTime: avail.startTime,
                    endTime: avail.endTime,
                    isActive: avail.isActive ?? true,
                },
                create: {
                    doctorId,
                    dayOfWeek: avail.dayOfWeek,
                    tenantId,
                    startTime: avail.startTime,
                    endTime: avail.endTime,
                    isActive: avail.isActive ?? true,
                },
            });
            results.push(result);
        }
        return results;
    }
};
exports.ScheduleService = ScheduleService;
exports.ScheduleService = ScheduleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ScheduleService);
//# sourceMappingURL=schedule.service.js.map