import { Test, TestingModule } from '@nestjs/testing';
import { CreatorService } from './creator.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Creator } from './entities/creator.entity';
import { SocialChannel } from '../social-channel/entities/social-channel.entity';
import { Media } from '../media/entities/media.entity';
import { Service } from '../service/entities/service.entity';
import { CreatorService as CreatorServiceEntity } from '../creator-service/entities/creator-service.entity';
import { CreatorServiceService } from '../creator-service/creator-service.service';
import { ObjectLiteral, Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateCreatorDto } from './dto/update-creator.dto';
import { CreateCategoryIdsDto, CreateTitleDto } from './dto/create-creator.dto';
import * as bcrypt from 'bcrypt';
import { ContentType } from '../../common/enums/contentType.enum';
import { Category } from '../category/category.entity';
import { BookingItem } from '../booking-item/entities/booking-item.entity';
import { Portfolio } from '../portfolio/entities/portfolio.entity';

type MockRepository<T extends ObjectLiteral> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const mockCreator = {
  id: 1,
  name: 'Test Creator',
  email: 'creator@example.com',
  title: 'Old Title',
  password: '',
  location: 'Old Location',
  description: 'Old Description',
  gender: 'Male',
  categories: [],
  phoneNumber: '12345',
};
const createMockRepository = <
  T extends ObjectLiteral,
>(): MockRepository<T> => ({
  create: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
});

describe('CreatorService', () => {
  let service: CreatorService;
  let creatorRepo: MockRepository<Creator>;
  let socialRepo: MockRepository<SocialChannel>;
  let mediaRepo: MockRepository<Media>;
  let serviceRepo: MockRepository<Service>;
  let creatorServiceRepo: MockRepository<CreatorServiceEntity>;
  let mockCreatorServiceService: Partial<CreatorServiceService>;
  let categoryRepo: MockRepository<Category>;
  let bookingItemRepo: MockRepository<BookingItem>;
  let portfolioRepo: MockRepository<Portfolio>;

  beforeEach(async () => {
    creatorRepo = createMockRepository<Creator>();
    socialRepo = createMockRepository<SocialChannel>();
    mediaRepo = createMockRepository<Media>();
    serviceRepo = createMockRepository<Service>();
    creatorServiceRepo = createMockRepository<CreatorServiceEntity>();
    categoryRepo = createMockRepository<Category>();
    bookingItemRepo = createMockRepository<BookingItem>();
    mockCreatorServiceService = { create: jest.fn() };
    portfolioRepo = createMockRepository<Portfolio>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatorService,
        {
          provide: getRepositoryToken(Creator),
          useValue: creatorRepo,
        },
        {
          provide: getRepositoryToken(SocialChannel),
          useValue: socialRepo,
        },
        {
          provide: getRepositoryToken(Media),
          useValue: mediaRepo,
        },
        {
          provide: getRepositoryToken(Service),
          useValue: serviceRepo,
        },
        {
          provide: getRepositoryToken(CreatorServiceEntity),
          useValue: creatorServiceRepo,
        },
        {
          provide: CreatorServiceService,
          useValue: mockCreatorServiceService,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: categoryRepo, // mock implementation for Category
        },
        {
          provide: getRepositoryToken(BookingItem),
          useValue: bookingItemRepo,
        },
        {
          provide: getRepositoryToken(Portfolio),
          useValue: portfolioRepo,
        },
      ],
    }).compile();

    service = module.get<CreatorService>(CreatorService);
  });

  // ===========================
  // findOne
  // ===========================
  describe('findOne', () => {
    it('should return a creator by ID', async () => {
      creatorRepo.findOne!.mockResolvedValue(mockCreator);

      const result = await service.findOne(1);

      expect(result).toEqual(mockCreator);
      expect(creatorRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: [
          'niches',
          'portfolio',
          'media',
          'socialChannels',
          'creatorServices',
          'receivedReviews',
          'writtenBrandReviews',
          'wallet',
        ],
      });
    });

    it('should throw NotFoundException if creator not found', async () => {
      creatorRepo.findOne!.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid ID', async () => {
      await expect(service.findOne(NaN)).rejects.toThrow(BadRequestException);
    });
  });

  // ===========================
  // updateProfile
  // ===========================
  describe('updateProfile', () => {
    it('should update a creator profile', async () => {
      const dto: UpdateCreatorDto = { name: 'Updated' };
      creatorRepo.findOne!.mockResolvedValue({ ...mockCreator });
      creatorRepo.save!.mockResolvedValue({ ...mockCreator, ...dto });

      const result = await service.updateProfile(1, dto);

      expect(result.creator.name).toBe('Updated');
      expect(creatorRepo.save).toHaveBeenCalled();
    });
  });

  // ===========================
  // createTitle
  // ===========================
  describe('createTitle', () => {
    it('should update the title of the creator', async () => {
      const dto: CreateTitleDto = { title: 'New Title' };
      creatorRepo.findOne!.mockResolvedValue({ ...mockCreator });
      creatorRepo.save!.mockResolvedValue({ ...mockCreator, title: dto.title });

      const result = await service.createTitle(1, dto);

      expect(result.title).toBe('New Title');
    });
  });

  // ===========================
  // updateAccount
  // ===========================
  describe('updateAccount', () => {
    it('should update email and password', async () => {
      const dto: UpdateCreatorDto = {
        email: 'new@example.com',
        password: '1234',
      };
      const hashed = await bcrypt.hash('oldpass', 10);

      creatorRepo.findOne!.mockResolvedValue({
        ...mockCreator,
        password: hashed,
      });
      creatorRepo.save!.mockResolvedValue({ ...mockCreator, email: dto.email });

      const result = await service.updateAccount('creator@example.com', dto);

      expect(result.success).toBe(true);
      expect(result.user.email).toBe(dto.email);
    });

    it('should return no update when same email and password', async () => {
      const hashed = await bcrypt.hash('oldpass', 10);
      const dto: UpdateCreatorDto = {
        email: mockCreator.email,
        password: 'oldpass',
      };
      creatorRepo.findOne!.mockResolvedValue({
        ...mockCreator,
        password: hashed,
      });

      const result = await service.updateAccount('creator@example.com', dto);

      expect(result.success).toBe(false);
      expect(result.message).toBeTruthy();
    });
  });

  // ===========================
  // verifyCurrentPassword
  // ===========================
  describe('verifyCurrentPassword', () => {
    it('should return true for correct password', async () => {
      const hashed = await bcrypt.hash('1234', 10);
      creatorRepo.findOne!.mockResolvedValue({
        ...mockCreator,
        password: hashed,
      });

      const result = await service.verifyCurrentPassword(
        'creator@example.com',
        '1234',
      );
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const hashed = await bcrypt.hash('1234', 10);
      creatorRepo.findOne!.mockResolvedValue({
        ...mockCreator,
        password: hashed,
      });

      const result = await service.verifyCurrentPassword(
        'creator@example.com',
        'wrong',
      );
      expect(result).toBe(false);
    });
  });

  // ===========================
  // createDescription
  // ===========================
  describe('createDescription', () => {
    it('should update description', async () => {
      const dto = { description: 'New Description' };
      creatorRepo.findOne!.mockResolvedValue({ ...mockCreator });
      creatorRepo.save!.mockResolvedValue({
        ...mockCreator,
        description: dto.description,
      });

      const result = await service.createDescription(1, dto as any);
      expect(result.description).toBe(dto.description);
    });
  });

  // ===========================
  // createGender
  // ===========================
  describe('createGender', () => {
    it('should update gender', async () => {
      const dto = { gender: 'Female' };
      creatorRepo.findOne!.mockResolvedValue({ ...mockCreator });
      creatorRepo.save!.mockResolvedValue({
        ...mockCreator,
        gender: dto.gender,
      });

      const result = await service.createGender(1, dto as any);
      expect(result.gender).toBe(dto.gender);
    });
  });

  // ===========================
  // createLocation
  // ===========================
  describe('createLocation', () => {
    it('should update location', async () => {
      const dto = { location: 'New Location' };
      creatorRepo.findOne!.mockResolvedValue({ ...mockCreator });
      creatorRepo.save!.mockResolvedValue({
        ...mockCreator,
        location: dto.location,
      });

      const result = await service.createLocation(1, dto as any);
      expect(result.location).toBe(dto.location);
    });
  });

  // ===========================
  // createSocialChannel
  // ===========================
  describe('createSocialChannel', () => {
    it('should create a social channel with auto URL', async () => {
      const dto = { platform: ContentType.INSTAGRAM, username: 'creator123' };
      creatorRepo.findOne!.mockResolvedValue(mockCreator);

      socialRepo.create!.mockReturnValue({ ...dto, creatorId: 1 });
      socialRepo.save!.mockResolvedValue({
        ...dto,
        id: 1,
        url: 'https://instagram.com/creator123',
      });

      const result = await service.createSocialChannel(1, dto as any);
      expect(result.url).toBe('https://instagram.com/creator123');
      expect(socialRepo.save).toHaveBeenCalled();
    });
  });

  // ===========================
  // createContentTypes
  // ===========================
  describe('createContentTypes', () => {
    it('should update categories', async () => {
      // DTO correct
      const dto: CreateCategoryIdsDto = { categoryIds: [1, 2] };

      // Mock du creatorRepository.findOne
      creatorRepo.findOne!.mockResolvedValue({
        ...mockCreator,
        categories: [], // relation vide au départ
      });

      // Mock du categoryRepository.find
      categoryRepo.find!.mockResolvedValue([
        { id: 1, name: 'fashion', label: 'Fashion' },
        { id: 2, name: 'beauty', label: 'Beauty' },
      ]);

      // Mock du creatorRepository.save
      creatorRepo.save!.mockImplementation(async (creator) =>
        JSON.parse(JSON.stringify(creator)),
      );

      const result = await service.createCategories(1, dto);

      // Vérifie que les catégories ont bien été mises à jour
      expect(result.categories).toEqual([
        { id: 1, name: 'fashion', label: 'Fashion' },
        { id: 2, name: 'beauty', label: 'Beauty' },
      ]);

      // Vérifie que find et save ont été appelés
      expect(categoryRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id: expect.anything(), // on ne teste pas le FindOperator exact
          }),
        }),
      );

      expect(creatorRepo.save).toHaveBeenCalled();
    });
  });

  // ===========================
  // createMedia
  // ===========================
  describe('createMedia', () => {
    it('should create media', async () => {
      const dto = { name: 'Media1', url: 'http://media.com' };
      creatorRepo.findOne!.mockResolvedValue(mockCreator);
      mediaRepo.create!.mockReturnValue({
        type: dto.name,
        url: dto.url,
        creatorId: 1,
      });
      mediaRepo.save!.mockResolvedValue({
        id: 1,
        type: dto.name,
        url: dto.url,
      });

      const result = await service.createMedia(1, dto as any);
      expect(result.type).toBe(dto.name);
      expect(mediaRepo.save).toHaveBeenCalled();
    });
  });

  // ===========================
  // createPhoneNumber
  // ===========================
  describe('createPhoneNumber', () => {
    it('should update phone number', async () => {
      const dto = { phoneNumber: '98765' };
      creatorRepo.findOne!.mockResolvedValue({ ...mockCreator });
      creatorRepo.save!.mockResolvedValue({
        ...mockCreator,
        phoneNumber: dto.phoneNumber,
      });

      const result = await service.createPhoneNumber(1, dto as any);
      expect(result.phoneNumber).toBe(dto.phoneNumber);
    });
  });

  // ===========================
  // addCreatorPackage
  // ===========================
  describe('addCreatorPackage', () => {
    it('should call creatorServiceService.create', async () => {
      const dto = { serviceId: 1, price: 100 } as any;

      creatorRepo.findOne!.mockResolvedValue(mockCreator);
      (mockCreatorServiceService.create as jest.Mock).mockResolvedValue({
        id: 1,
      });

      const result = await service.addCreatorPackage(1, dto);
      expect(result.id).toBe(1);
      expect(mockCreatorServiceService.create).toHaveBeenCalledWith(1, dto);
    });
  });

  // ===========================
  // getCreatorBookingItems
  // ===========================
  describe('getCreatorBookingItems', () => {
    it('should throw NotFoundException if creator does not exist', async () => {
      creatorRepo.findOne!.mockResolvedValue(null);

      await expect(service.getCreatorBookingItems(1)).rejects.toThrow(
        NotFoundException,
      );
      expect(creatorRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return empty array if no creator services', async () => {
      creatorRepo.findOne!.mockResolvedValue(mockCreator);
      creatorServiceRepo.find!.mockResolvedValue([]); // no services

      const result = await service.getCreatorBookingItems(1);

      expect(result).toEqual([]);
      expect(creatorServiceRepo.find).toHaveBeenCalledWith({
        where: { creatorId: 1 },
      });
    });

    it('should return booking items linked to creator services', async () => {
      creatorRepo.findOne!.mockResolvedValue(mockCreator);
      creatorServiceRepo.find!.mockResolvedValue([
        { id: 10, creatorId: 1 },
        { id: 20, creatorId: 1 },
      ]);

      const mockBookingItems = [
        { id: 100, creatorService: { id: 10 }, booking: { id: 500 } },
        { id: 200, creatorService: { id: 20 }, booking: { id: 600 } },
      ];

      bookingItemRepo.find!.mockResolvedValue(mockBookingItems);

      const result = await service.getCreatorBookingItems(1);

      expect(result).toEqual(mockBookingItems);
      expect(bookingItemRepo.find).toHaveBeenCalledWith({
        where: { creatorService: { id: expect.any(Object) } },
        relations: ['booking', 'creatorService'],
      });
    });
  });
});
