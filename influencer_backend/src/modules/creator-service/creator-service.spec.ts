import { Test, TestingModule } from '@nestjs/testing';
import { CreatorServiceService } from './creator-service.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatorService } from './entities/creator-service.entity';
import { Creator } from '../creator/entities/creator.entity';
import { Service } from '../service/entities/service.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateCreatorServiceDto } from './dto/create-creator-service.dto';

import { ObjectLiteral } from 'typeorm';

type MockRepo<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepo = <T extends ObjectLiteral = any>(): MockRepo<T> => ({
  create: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  update: jest.fn(),
  findOneBy: jest.fn(),
  find: jest.fn(),
});

describe('CreatorServiceService', () => {
  let service: CreatorServiceService;
  let creatorServiceRepo: MockRepo<CreatorService>;
  let creatorRepo: MockRepo<Creator>;
  let serviceRepo: MockRepo<Service>;

  const mockCreator = { id: 1, name: 'Test Creator' };
  const mockService = { id: 1, name: 'Test Service' };
  const mockCreatorService = { id: 1, creatorId: 1, serviceId: 1, price: 100 };

  beforeEach(async () => {
    creatorServiceRepo = createMockRepo<CreatorService>();
    creatorRepo = createMockRepo<Creator>();
    serviceRepo = createMockRepo<Service>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatorServiceService,
        {
          provide: getRepositoryToken(CreatorService),
          useValue: creatorServiceRepo,
        },
        { provide: getRepositoryToken(Creator), useValue: creatorRepo },
        { provide: getRepositoryToken(Service), useValue: serviceRepo },
      ],
    }).compile();

    service = module.get<CreatorServiceService>(CreatorServiceService);
  });

  // ===========================
  // create
  // ===========================
  describe('create', () => {
    it('should create a creator service', async () => {
      const dto: CreateCreatorServiceDto = {
        serviceId: 1,
        price: 100,
        quantity: 1,
      };
      creatorRepo.findOne!.mockResolvedValue(mockCreator);
      serviceRepo.findOne!.mockResolvedValue(mockService);
      creatorServiceRepo.create!.mockReturnValue(mockCreatorService);
      creatorServiceRepo.save!.mockResolvedValue(mockCreatorService);

      const result = await service.create(1, dto);

      expect(result).toEqual(mockCreatorService);
      expect(creatorServiceRepo.save).toHaveBeenCalledWith(mockCreatorService);
    });

    it('should throw NotFoundException if creator not found', async () => {
      const dto: CreateCreatorServiceDto = {
        serviceId: 1,
        price: 100,
        quantity: 1,
      };
      creatorRepo.findOne!.mockResolvedValue(null);

      await expect(service.create(1, dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if service not found', async () => {
      const dto: CreateCreatorServiceDto = {
        serviceId: 1,
        price: 100,
        quantity: 1,
      };
      creatorRepo.findOne!.mockResolvedValue(mockCreator);
      serviceRepo.findOne!.mockResolvedValue(null);

      await expect(service.create(1, dto)).rejects.toThrow(NotFoundException);
    });
  });

  // ===========================
  // removePackage
  // ===========================
  describe('removePackage', () => {
    it('should remove a creator service package', async () => {
      creatorServiceRepo.findOne!.mockResolvedValue({
        ...mockCreatorService,
        creator: { id: 1 },
      });
      creatorServiceRepo.remove!.mockResolvedValue({});

      const result = await service.removePackage(1, 1);

      expect(result).toEqual({
        message: `Package 1 removed successfully`,
        status: true,
        statusCode: 200,
      });
      expect(creatorServiceRepo.remove).toHaveBeenCalled();
    });

    it('should throw NotFoundException if package not found', async () => {
      creatorServiceRepo.findOne!.mockResolvedValue(null);

      await expect(service.removePackage(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ===========================
  // getCreatorPackage
  // ===========================
  describe('getCreatorPackage', () => {
    it('should return packages with contentType', async () => {
      creatorServiceRepo.find!.mockResolvedValue([
        { ...mockCreatorService, service: { name: 'Test Service' } },
      ]);

      const result = await service.getCreatorPackage(1);

      expect(result).toEqual([
        {
          id: 1,
          creatorId: 1,
          serviceId: 1,
          price: 100,
          contentType: 'Test Service',
        },
      ]);
    });

    it('should throw NotFoundException if no packages found', async () => {
      creatorServiceRepo.find!.mockResolvedValue([]);

      await expect(service.getCreatorPackage(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ===========================
  // update
  // ===========================
  describe('update', () => {
    it('should update a creator service package', async () => {
      const dto: CreateCreatorServiceDto = {
        serviceId: 2,
        price: 200,
        quantity: 2,
      };
      creatorServiceRepo.update!.mockResolvedValue({ affected: 1 });
      creatorServiceRepo.findOneBy!.mockResolvedValue({ id: 1, ...dto });

      const result = await service.update(1, dto);

      expect(result).toEqual({ id: 1, ...dto });
      expect(creatorServiceRepo.update).toHaveBeenCalledWith(1, dto);
    });
  });
});
