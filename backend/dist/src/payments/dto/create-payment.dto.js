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
exports.CreatePaymentDto = exports.ServiceType = exports.PaymentMethod = exports.CoverageType = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var CoverageType;
(function (CoverageType) {
    CoverageType["SELF"] = "SELF";
    CoverageType["GOVERNMENT_BOOK"] = "GOVERNMENT_BOOK";
    CoverageType["NGO"] = "NGO";
    CoverageType["OTHER"] = "OTHER";
})(CoverageType || (exports.CoverageType = CoverageType = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "CASH";
    PaymentMethod["WAIVED"] = "WAIVED";
    PaymentMethod["PARTIAL"] = "PARTIAL";
    PaymentMethod["OTHER"] = "OTHER";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var ServiceType;
(function (ServiceType) {
    ServiceType["REGISTRATION"] = "REGISTRATION";
    ServiceType["CONSULTATION"] = "CONSULTATION";
    ServiceType["LABORATORY"] = "LABORATORY";
    ServiceType["PHARMACY"] = "PHARMACY";
    ServiceType["PROCEDURE"] = "PROCEDURE";
    ServiceType["RADIOLOGY"] = "RADIOLOGY";
    ServiceType["OTHER"] = "OTHER";
})(ServiceType || (exports.ServiceType = ServiceType = {}));
class CoverageDto {
    type;
    referenceNumber;
    issuedToName;
    issueYear;
    expiryYear;
    notes;
    insurancePolicyId;
}
__decorate([
    (0, class_validator_1.IsEnum)(CoverageType),
    __metadata("design:type", String)
], CoverageDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CoverageDto.prototype, "referenceNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CoverageDto.prototype, "issuedToName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CoverageDto.prototype, "issueYear", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CoverageDto.prototype, "expiryYear", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CoverageDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CoverageDto.prototype, "insurancePolicyId", void 0);
class CreatePaymentDto {
    visitId;
    amountCharged;
    amountPaid;
    method;
    serviceType;
    reason;
    status;
    labOrderId;
    pharmacyOrderId;
    insurancePolicyId;
    coverage;
}
exports.CreatePaymentDto = CreatePaymentDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "visitId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePaymentDto.prototype, "amountCharged", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePaymentDto.prototype, "amountPaid", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(PaymentMethod),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "method", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(ServiceType),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "serviceType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "labOrderId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "pharmacyOrderId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "insurancePolicyId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CoverageDto),
    __metadata("design:type", CoverageDto)
], CreatePaymentDto.prototype, "coverage", void 0);
//# sourceMappingURL=create-payment.dto.js.map