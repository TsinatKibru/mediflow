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
exports.PharmacyOrdersController = void 0;
const common_1 = require("@nestjs/common");
const pharmacy_orders_service_1 = require("./pharmacy-orders.service");
const pharmacy_order_dto_1 = require("./dto/pharmacy-order.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const tenant_guard_1 = require("../auth/guards/tenant.guard");
let PharmacyOrdersController = class PharmacyOrdersController {
    pharmacyOrdersService;
    constructor(pharmacyOrdersService) {
        this.pharmacyOrdersService = pharmacyOrdersService;
    }
    create(req, createPharmacyOrderDto) {
        return this.pharmacyOrdersService.create(req.user.tenantId, req.user.userId, createPharmacyOrderDto);
    }
    findAll(req, status) {
        return this.pharmacyOrdersService.findAll(req.user.tenantId, status);
    }
    findByVisit(req, visitId) {
        return this.pharmacyOrdersService.findByVisit(req.user.tenantId, visitId);
    }
    updateStatus(req, id, dto) {
        return this.pharmacyOrdersService.updateStatus(req.user.tenantId, id, req.user.userId, dto);
    }
};
exports.PharmacyOrdersController = PharmacyOrdersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pharmacy_order_dto_1.CreatePharmacyOrderDto]),
    __metadata("design:returntype", void 0)
], PharmacyOrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PharmacyOrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('visit/:visitId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('visitId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PharmacyOrdersController.prototype, "findByVisit", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, pharmacy_order_dto_1.UpdatePharmacyOrderStatusDto]),
    __metadata("design:returntype", void 0)
], PharmacyOrdersController.prototype, "updateStatus", null);
exports.PharmacyOrdersController = PharmacyOrdersController = __decorate([
    (0, common_1.Controller)('pharmacy-orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [pharmacy_orders_service_1.PharmacyOrdersService])
], PharmacyOrdersController);
//# sourceMappingURL=pharmacy-orders.controller.js.map