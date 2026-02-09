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
exports.InsurancePoliciesController = void 0;
const common_1 = require("@nestjs/common");
const insurance_policies_service_1 = require("./insurance-policies.service");
const create_insurance_policy_dto_1 = require("./dto/create-insurance-policy.dto");
const update_insurance_policy_dto_1 = require("./dto/update-insurance-policy.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const tenant_guard_1 = require("../auth/guards/tenant.guard");
let InsurancePoliciesController = class InsurancePoliciesController {
    insurancePoliciesService;
    constructor(insurancePoliciesService) {
        this.insurancePoliciesService = insurancePoliciesService;
    }
    create(req, createInsurancePolicyDto) {
        return this.insurancePoliciesService.create(createInsurancePolicyDto, req.user.tenantId);
    }
    findAll(req, patientId) {
        if (patientId) {
            return this.insurancePoliciesService.findAllByPatient(patientId, req.user.tenantId);
        }
        return [];
    }
    findOne(req, id) {
        return this.insurancePoliciesService.findOne(id, req.user.tenantId);
    }
    update(req, id, updateInsurancePolicyDto) {
        return this.insurancePoliciesService.update(id, updateInsurancePolicyDto, req.user.tenantId);
    }
    remove(req, id) {
        return this.insurancePoliciesService.remove(id, req.user.tenantId);
    }
};
exports.InsurancePoliciesController = InsurancePoliciesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_insurance_policy_dto_1.CreateInsurancePolicyDto]),
    __metadata("design:returntype", void 0)
], InsurancePoliciesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], InsurancePoliciesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], InsurancePoliciesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_insurance_policy_dto_1.UpdateInsurancePolicyDto]),
    __metadata("design:returntype", void 0)
], InsurancePoliciesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], InsurancePoliciesController.prototype, "remove", null);
exports.InsurancePoliciesController = InsurancePoliciesController = __decorate([
    (0, common_1.Controller)('insurance-policies'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [insurance_policies_service_1.InsurancePoliciesService])
], InsurancePoliciesController);
//# sourceMappingURL=insurance-policies.controller.js.map