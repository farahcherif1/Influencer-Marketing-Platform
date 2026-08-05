import { Test, TestingModule } from '@nestjs/testing';
import { ServiceService } from './service.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { ObjectLiteral } from 'typeorm';
import { ContentType } from '../../common/enums/contentType.enum';
import { Category } from '../../modules/category/category.entity';
import { CreatorServiceService } from '../../modules/creator-service/creator-service.service';

type MockRepo<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepo = <T extends ObjectLiteral = any>(): MockRepo<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
});

describe('ServiceService', () => {
  let service: ServiceService;
  let serviceRepo: MockRepo<Service>;
  const categoryRepo = createMockRepo<Category>();
  const mockCreatorServiceService = { create: jest.fn() };

  const mockService = { id: 1, name: 'Test Service', hasDuration: true };

  beforeEach(async () => {
    serviceRepo = createMockRepo<Service>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceService,
        { provide: getRepositoryToken(Service), useValue: serviceRepo },
        { provide: getRepositoryToken(Category), useValue: categoryRepo },
        { provide: CreatorServiceService, useValue: mockCreatorServiceService },
      ],
    }).compile();

    service = module.get<ServiceService>(ServiceService);
  });

  // ===========================
  // create
  // ===========================
  describe('create', () => {
    it('should create a new service', async () => {
      const dto: CreateServiceDto = {
        name: 'Service1',
        hasDuration: true,
        platform: ContentType.INSTAGRAM,
      };
      serviceRepo.create!.mockReturnValue(dto);
      serviceRepo.save!.mockResolvedValue({ id: 2, ...dto });

      const result = await service.create(dto);

      expect(result).toEqual({ id: 2, ...dto });
      expect(serviceRepo.create).toHaveBeenCalledWith(dto);
      expect(serviceRepo.save).toHaveBeenCalledWith(dto);
    });
  });

  // ===========================
  // findAll
  // ===========================
  describe('findAll', () => {
    it('should return all services', async () => {
      serviceRepo.find!.mockResolvedValue([mockService]);

      const result = await service.findAll();

      expect(result).toEqual([mockService]);
      expect(serviceRepo.find).toHaveBeenCalled();
    });
  });

  // ===========================
  // getByName
  // ===========================
  describe('getByName', () => {
    it('should return service id by name', async () => {
      serviceRepo.findOne!.mockResolvedValue(mockService);

      const result = await service.getByName('Test Service');

      expect(result).toBe(mockService.id);
      expect(serviceRepo.findOne).toHaveBeenCalledWith({
        where: { name: 'Test Service' },
      });
    });

    it('should throw NotFoundException if service not found', async () => {
      serviceRepo.findOne!.mockResolvedValue(null);

      await expect(service.getByName('Missing Service')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ===========================
  // getAllServiceNames
  // ===========================
  describe('getAllServiceNames', () => {
    it('should return all service names', async () => {
      serviceRepo.find!.mockResolvedValue([
        { name: 'Service1' },
        { name: 'Service2' },
      ]);

      const result = await service.getAllServiceNames();

      expect(result).toEqual(['Service1', 'Service2']);
      expect(serviceRepo.find).toHaveBeenCalledWith({ select: ['name'] });
    });
  });

  // ===========================
  // getServicesWithDuration
  // ===========================
  describe('getServicesWithDuration', () => {
    it('should return IDs of services with duration', async () => {
      serviceRepo.find!.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      const result = await service.getServicesWithDuration();

      expect(result).toEqual([1, 2]);
      expect(serviceRepo.find).toHaveBeenCalledWith({
        select: ['id'],
        where: { hasDuration: true },
      });
    });
  });
});
