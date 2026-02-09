import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    appointment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      patientId: 'patient-1',
      doctorId: 'doctor-1',
      startTime: '2023-10-10T10:00:00Z',
      endTime: '2023-10-10T11:00:00Z',
      reason: 'Checkup',
    };
    const tenantId = 'tenant-1';

    it('should create an appointment if no overlap', async () => {
      mockPrismaService.appointment.count.mockResolvedValue(0);
      mockPrismaService.appointment.create.mockResolvedValue({ id: 'apt-1', ...createDto, tenantId });

      const result = await service.create(createDto, tenantId);

      expect(mockPrismaService.appointment.count).toHaveBeenCalled();
      expect(mockPrismaService.appointment.create).toHaveBeenCalledWith({
        data: { ...createDto, tenantId },
      });
      expect(result).toEqual({ id: 'apt-1', ...createDto, tenantId });
    });

    it('should throw BadRequestException if overlap exists', async () => {
      mockPrismaService.appointment.count.mockResolvedValue(1);

      await expect(service.create(createDto, tenantId)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if endTime is before startTime', async () => {
      const invalidDto = { ...createDto, endTime: '2023-10-10T09:00:00Z' };
      await expect(service.create(invalidDto, tenantId)).rejects.toThrow(BadRequestException);
    });
  });
});
