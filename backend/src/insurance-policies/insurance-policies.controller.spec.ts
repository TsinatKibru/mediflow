import { Test, TestingModule } from '@nestjs/testing';
import { InsurancePoliciesController } from './insurance-policies.controller';

describe('InsurancePoliciesController', () => {
  let controller: InsurancePoliciesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsurancePoliciesController],
    }).compile();

    controller = module.get<InsurancePoliciesController>(InsurancePoliciesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
