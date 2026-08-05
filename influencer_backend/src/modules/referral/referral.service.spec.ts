import { Test, TestingModule } from '@nestjs/testing';
import { ReferralService } from './referral.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Referral } from './entities/referral.entity';
import { Brand } from '../brand/entities/brand.entity';
import { MailerService } from '../mailer/mailer.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';

type MockRepository<T extends ObjectLiteral> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepository = <
  T extends ObjectLiteral,
>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('ReferralService', () => {
  let service: ReferralService;
  let userRepository: MockRepository<User>;
  let referralRepository: MockRepository<Referral>;
  let brandRepository: MockRepository<Brand>;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReferralService,
        { provide: getRepositoryToken(User), useValue: createMockRepository() },
        {
          provide: getRepositoryToken(Referral),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Brand),
          useValue: createMockRepository(),
        },
        {
          provide: MailerService,
          useValue: { sendReferralInviteEmail: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ReferralService>(ReferralService);
    userRepository = module.get(getRepositoryToken(User));
    referralRepository = module.get(getRepositoryToken(Referral));
    brandRepository = module.get(getRepositoryToken(Brand));
    mailerService = module.get(MailerService);
  });

  describe('createReferral', () => {
    const referralCode = 'ref123';
    const brandId = 42;

    it('should throw NotFoundException if referrer not found', async () => {
      if (userRepository.findOne) {
        userRepository.findOne.mockResolvedValue(undefined);
      }

      await expect(
        service.createReferral(referralCode, brandId),
      ).rejects.toThrow(NotFoundException);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { referralCode },
      });
    });

    it('should throw NotFoundException if brand not found', async () => {
      userRepository.findOne?.mockResolvedValue({ id: 1 });

      brandRepository.findOne?.mockResolvedValue(undefined);

      await expect(
        service.createReferral(referralCode, brandId),
      ).rejects.toThrow(NotFoundException);
      brandRepository.findOne?.mockResolvedValue({ where: { id: brandId } });
    });

    it('should throw ConflictException if referral already exists for the brand', async () => {
      userRepository.findOne?.mockResolvedValue({ id: 1 });
      brandRepository.findOne?.mockResolvedValue({ id: brandId });
      referralRepository.findOne?.mockResolvedValue({ id: 999 });

      await expect(
        service.createReferral(referralCode, brandId),
      ).rejects.toThrow(ConflictException);
      expect(referralRepository.findOne).toHaveBeenCalledWith({
        where: { brandId },
      });
    });

    it('should create and return a referral successfully', async () => {
      const referrer = { id: 1 };
      const brand = { id: brandId };
      const savedReferral = { id: 10, referrerId: 1, brandId };

      userRepository.findOne?.mockResolvedValue(referrer);
      brandRepository.findOne?.mockResolvedValue(brand);
      referralRepository.findOne?.mockResolvedValue(null);
      referralRepository.create?.mockReturnValue(savedReferral);
      referralRepository.save?.mockResolvedValue(savedReferral);

      const result = await service.createReferral(referralCode, brandId);

      expect(referralRepository.create).toHaveBeenCalledWith({
        referrerId: 1,
        brandId,
      });
      expect(referralRepository.save).toHaveBeenCalledWith(savedReferral);
      expect(result).toEqual(savedReferral);
    });
  });
});
