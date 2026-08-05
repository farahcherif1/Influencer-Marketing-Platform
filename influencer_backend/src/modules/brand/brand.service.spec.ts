import { Test, TestingModule } from '@nestjs/testing';
import { BrandService } from './brand.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Category } from '../category/category.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Booking } from '../booking/entities/booking.entity';
import { S3Service } from '../../s3/s3.service';

describe('BrandService', () => {
  let service: BrandService;
  let brandRepo: jest.Mocked<Partial<Repository<Brand>>>;
  let categoryRepo: jest.Mocked<Partial<Repository<Category>>>;
  let bookingRepo: jest.Mocked<Partial<Repository<Booking>>>;

  beforeEach(async () => {
    brandRepo = {
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
    };

    categoryRepo = {
      find: jest.fn(),
    };
    bookingRepo = {
      find: jest.fn(),
    };
    const s3ServiceMock = {
      uploadFile: jest.fn().mockResolvedValue('new-key'),
      getSignedUrlForGet: jest.fn().mockResolvedValue('signed-url'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandService,
        { provide: S3Service, useValue: s3ServiceMock },
        {
          provide: getRepositoryToken(Brand),
          useValue: brandRepo,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: categoryRepo,
        },
        {
          provide: getRepositoryToken(Booking),
          useValue: bookingRepo,
        },
      ],
    }).compile();

    service = module.get<BrandService>(BrandService);
  });

  it('should return a brand when found', async () => {
    const fakeBrand = {
      id: '1',
      name: 'Nike',
      userName: 'nike',
      description: 'Sport brand',
      socialChannels: [],
    } as unknown as Brand;

    (brandRepo.findOne as jest.Mock).mockResolvedValue(fakeBrand);

    const result = await service.findById(1);

    expect(result).toEqual(fakeBrand);
    expect(brandRepo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['socialChannels'],
    });
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updatePartialBrand', () => {
    const existingBrand = {
      id: 1,
      brandName: 'Test Brand',
      brandRole: 'Retail',
      logoUrl: 'old-url',
      description: 'Old desc',
      industry: 'Fashion',
      categories: [],
      targetPlatforms: ['Instagram'],
      piecesOfContentPerMonth: 5,
      annualBudget: 50000,
    } as unknown as Brand;

    it('should update simple fields and return updated brand', async () => {
      const updateDto = {
        logoUrl: 'new-url',
        description: 'New desc',
      };

      (brandRepo.findOne as jest.Mock).mockResolvedValue(existingBrand);
      (brandRepo.save as jest.Mock).mockImplementation(async (b) => ({
        ...(b as Brand),
      }));

      const result = await service.updatePartialBrand(1, updateDto);

      expect(brandRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['categories'],
      });

      expect(brandRepo.save).toHaveBeenCalledWith(
        expect.objectContaining(updateDto),
      );
      expect(result.logoUrl).toBe('new-url');
      expect(result.description).toBe('New desc');
    });

    it('should assign categories when categoryIds provided', async () => {
      const categoryEntities: Category[] = [
        { id: 1, name: 'fashion', label: 'Fashion', users: [] } as Category,
        {
          id: 2,
          name: 'technology',
          label: 'Technology',
          users: [],
        } as Category,
      ];

      const dto = { categoryIds: [1, 2] };

      (brandRepo.findOne as jest.Mock).mockResolvedValue(existingBrand);
      (categoryRepo.find as jest.Mock).mockResolvedValue(categoryEntities);
      (brandRepo.save as jest.Mock).mockImplementation(async (b) => ({
        ...(b as Brand),
      }));

      const result = await service.updatePartialBrand(1, dto);

      // ensure categories were loaded from categoryRepo
      expect(categoryRepo.find).toHaveBeenCalled();
      // ensure brandRepo.save was called with categories set
      expect(brandRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          categories: categoryEntities,
        }),
      );
      expect(result.categories).toEqual(categoryEntities);
    });

    it('should throw NotFoundException if brand not found', async () => {
      (brandRepo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.updatePartialBrand(999, {})).rejects.toThrow(
        NotFoundException,
      );
      expect(brandRepo.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['categories'],
      });
      expect(brandRepo.save).not.toHaveBeenCalled();
    });
  });
  describe('getBookings', () => {
    it('should throw NotFoundException if brand not found', async () => {
      (brandRepo.findOneBy as jest.Mock).mockResolvedValue(null);
      await expect(service.getBookings(1)).rejects.toThrow(NotFoundException);
    });

    it('should return empty array if brand exists but has no bookings', async () => {
      (brandRepo.findOneBy as jest.Mock).mockResolvedValue({ id: 1 });
      (bookingRepo.find as jest.Mock).mockResolvedValue([]);

      const result = await service.getBookings(1);

      expect(result).toEqual([]);
      expect(bookingRepo.find).toHaveBeenCalledWith({
        where: { brandId: 1 },
        relations: ['bookingItems'],
      });
    });

    it('should return bookingItems from multiple bookings', async () => {
      (brandRepo.findOneBy as jest.Mock).mockResolvedValue({ id: 1 });

      const booking1 = { id: 10, bookingItems: [{ id: 100 }, { id: 101 }] };
      const booking2 = { id: 20, bookingItems: [{ id: 200 }] };

      (bookingRepo.find as jest.Mock).mockResolvedValue([booking1, booking2]);

      const result = await service.getBookings(1);

      expect(result).toEqual([{ id: 100 }, { id: 101 }, { id: 200 }]);
    });
  });

  describe('updateProfilePicture', () => {
    it('should update logoUrl when brand exists', async () => {
      const brand = { id: 1, logoKey: 'old-key' } as Brand;
      (brandRepo.findOne as jest.Mock).mockResolvedValue(brand);
      (brandRepo.save as jest.Mock).mockImplementation(async (b) => b);

      // Mock a file
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'new.png',
        encoding: '7bit',
        mimetype: 'image/png',
        buffer: Buffer.from('dummy content'),
        size: 1234,
        stream: {} as any,
        destination: '',
        filename: 'new.png',
        path: '',
      };

      const result = await service.updateProfilePicture(1, mockFile);

      expect(brandRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(brandRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ logoKey: 'new-key' }),
      );
      expect(result.logoUrl).toBe('signed-url');
    });

    it('should throw NotFoundException if brand does not exist', async () => {
      (brandRepo.findOne as jest.Mock).mockResolvedValue(null);
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'new.png',
        encoding: '7bit',
        mimetype: 'image/png',
        buffer: Buffer.from('dummy content'),
        size: 1234,
        stream: {} as any,
        destination: '',
        filename: 'new.png',
        path: '',
      };

      await expect(service.updateProfilePicture(123, mockFile)).rejects.toThrow(
        NotFoundException,
      );
      expect(brandRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('updateCoverPicture', () => {
    it('should update coverPhotoUrl when brand exists', async () => {
      const brand = { id: 2, coverPhotoUrl: 'old-cover.png' } as Brand;
      (brandRepo.findOne as jest.Mock).mockResolvedValue(brand);
      (brandRepo.save as jest.Mock).mockImplementation(async (b) => b);
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'new-cover.png',
        encoding: '7bit',
        mimetype: 'image/png',
        buffer: Buffer.from('dummy content'),
        size: 1234,
        stream: {} as any,
        destination: '',
        filename: 'new-cover.png',
        path: '',
      };

      const result = await service.updateCoverPicture(2, mockFile);

      expect(brandRepo.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
      expect(brandRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ coverKey: 'new-key' }),
      );

      expect(result.coverPhotoUrl).toBe('signed-url');
    });

    it('should throw NotFoundException if brand does not exist', async () => {
      (brandRepo.findOne as jest.Mock).mockResolvedValue(null);
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'new-cover.png',
        encoding: '7bit',
        mimetype: 'image/png',
        buffer: Buffer.from('dummy content'),
        size: 1234,
        stream: {} as any,
        destination: '',
        filename: 'new-cover.png',
        path: '',
      };

      await expect(service.updateCoverPicture(999, mockFile)).rejects.toThrow(
        NotFoundException,
      );
      expect(brandRepo.save).not.toHaveBeenCalled();
    });
  });
});
