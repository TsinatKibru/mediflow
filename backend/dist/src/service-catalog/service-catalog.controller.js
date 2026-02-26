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
exports.ServiceCatalogController = void 0;
const common_1 = require("@nestjs/common");
const service_catalog_service_1 = require("./service-catalog.service");
const service_catalog_dto_1 = require("./dto/service-catalog.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const tenant_guard_1 = require("../auth/guards/tenant.guard");
let ServiceCatalogController = class ServiceCatalogController {
    serviceCatalogService;
    constructor(serviceCatalogService) {
        this.serviceCatalogService = serviceCatalogService;
    }
    create(req, dto) {
        return this.serviceCatalogService.create(req.user.tenantId, dto);
    }
    findAll(req, category) {
        return this.serviceCatalogService.findAll(req.user.tenantId, category);
    }
    findOne(req, id) {
        return this.serviceCatalogService.findOne(req.user.tenantId, id);
    }
    update(req, id, dto) {
        return this.serviceCatalogService.update(req.user.tenantId, id, dto);
    }
    remove(req, id) {
        return this.serviceCatalogService.remove(req.user.tenantId, id);
    }
};
exports.ServiceCatalogController = ServiceCatalogController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, service_catalog_dto_1.CreateServiceCatalogDto]),
    __metadata("design:returntype", void 0)
], ServiceCatalogController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ServiceCatalogController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ServiceCatalogController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, service_catalog_dto_1.UpdateServiceCatalogDto]),
    __metadata("design:returntype", void 0)
], ServiceCatalogController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ServiceCatalogController.prototype, "remove", null);
exports.ServiceCatalogController = ServiceCatalogController = __decorate([
    (0, common_1.Controller)('service-catalog'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [service_catalog_service_1.ServiceCatalogService])
], ServiceCatalogController);
//# sourceMappingURL=service-catalog.controller.js.map