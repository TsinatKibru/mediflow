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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabOrdersController = void 0;
const common_1 = require("@nestjs/common");
const lab_orders_service_1 = require("./lab-orders.service");
const lab_order_dto_1 = require("./dto/lab-order.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const tenant_guard_1 = require("../auth/guards/tenant.guard");
let LabOrdersController = class LabOrdersController {
    labOrdersService;
    constructor(labOrdersService) {
        this.labOrdersService = labOrdersService;
    }
    findAll(req, status) {
        return this.labOrdersService.findAll(req.user.tenantId, status);
    }
    create(req, createLabOrderDto) {
        return this.labOrdersService.create(req.user.tenantId, req.user.userId, createLabOrderDto);
    }
    findByVisit(req, visitId) {
        return this.labOrdersService.findByVisit(req.user.tenantId, visitId);
    }
    update(req, id, updateLabOrderDto) {
        return this.labOrdersService.update(req.user.tenantId, id, updateLabOrderDto);
    }
    remove(req, id) {
        return this.labOrdersService.delete(req.user.tenantId, id);
    }
};
exports.LabOrdersController = LabOrdersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LabOrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, lab_order_dto_1.CreateLabOrderDto]),
    __metadata("design:returntype", void 0)
], LabOrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('visit/:visitId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('visitId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LabOrdersController.prototype, "findByVisit", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, lab_order_dto_1.UpdateLabOrderDto]),
    __metadata("design:returntype", void 0)
], LabOrdersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LabOrdersController.prototype, "remove", null);
exports.LabOrdersController = LabOrdersController = __decorate([
    (0, common_1.Controller)('lab-orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [lab_orders_service_1.LabOrdersService])
], LabOrdersController);
//# sourceMappingURL=lab-orders.controller.js.map