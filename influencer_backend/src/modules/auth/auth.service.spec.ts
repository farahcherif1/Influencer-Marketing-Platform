import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../modules/user/entities/user.entity';
import { Token } from '../../modules/auth/entities/token.entity';
import { MailerService } from '../../modules/mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/create-auth.dto';
import { Brand } from '../brand/entities/brand.entity';
import { Creator } from '../creator/entities/creator.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import * as bcrypt from 'bcrypt';
import { Cart } from '../../modules/cart/entities/cart.entity';
import type { Response } from 'express-serve-static-core';

// tiny helper to build a Response with a typed `cookie` mock
const makeRes = () =>
  ({
    cookie: jest.fn<
      ReturnType<Response['cookie']>,
      Parameters<Response['cookie']>
    >(),
  }) as unknown as Response;

describe('AuthService (Inheritance Model)', () => {
  let service: AuthService;

  let userRepo: { [k: string]: jest.Mock };
  let tokenRepo: { [k: string]: jest.Mock };
  let brandRepo: { [k: string]: jest.Mock };
  let cartRepo: { [k: string]: jest.Mock };
  let creatorRepo: { [k: string]: jest.Mock };
  let mailerService: {
    sendVerificationEmail: jest.Mock;
    sendWelcomeEmailToBrand: jest.Mock;
    sendWelcomeEmailToCreator: jest.Mock;
    sendPasswordResetEmail: jest.Mock;
  };
  let jwtService: { sign: jest.Mock };

  beforeEach(async () => {
    userRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    tokenRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    brandRepo = {
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findOne: jest.fn(),
    };
    cartRepo = {
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    creatorRepo = {
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findOne: jest.fn(),
    };

    mailerService = {
      sendVerificationEmail: jest.fn(),
      sendWelcomeEmailToBrand: jest.fn(),
      sendWelcomeEmailToCreator: jest.fn(),
      sendPasswordResetEmail: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mocked-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: MailerService, useValue: mailerService },
        { provide: JwtService, useValue: jwtService },
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: getRepositoryToken(Token), useValue: tokenRepo },
        { provide: getRepositoryToken(Brand), useValue: brandRepo },
        { provide: getRepositoryToken(Creator), useValue: creatorRepo },
        { provide: getRepositoryToken(Cart), useValue: cartRepo },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup()', () => {
    it('throws if email already exists', async () => {
      const dto: SignupDto = {
        name: 'John',
        email: 'test@example.com',
        password: '123456',
      };

      userRepo.findOne.mockResolvedValueOnce({ id: 1 } as User);

      await expect(service.signup(dto, 'brand')).rejects.toThrow(
        'Email already used',
      );
      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('throws if username already exists for brand signup', async () => {
      const dto: SignupDto = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: '123456',
        brandName: 'CoolBrand',
      };

      userRepo.findOne
        .mockResolvedValueOnce(null) // email check
        .mockResolvedValueOnce(null); // name check

      // Mock existing username
      brandRepo.findOne.mockResolvedValueOnce({
        id: 1,
        username: 'janedoe',
      } as Brand);

      jest
        .spyOn(service, 'generateReferralCode')
        .mockResolvedValue('janeref123');
      jest.spyOn(service, 'hashPassword').mockResolvedValue('hashedPassword');

      await expect(service.signup(dto, 'brand')).rejects.toThrow(
        'Username already taken',
      );

      expect(brandRepo.findOne).toHaveBeenCalledWith({
        where: { username: 'janedoe' },
      });
    });

    it('creates a Brand-derived user with username and sends verification email', async () => {
      const dto: SignupDto = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: '123456',
        brandName: 'CoolBrand',
      };

      // 1st findOne -> email check (no existing)
      userRepo.findOne.mockResolvedValueOnce(null); // email check

      // Username availability check
      brandRepo.findOne.mockResolvedValueOnce(null); // no existing username

      jest
        .spyOn(service, 'generateReferralCode')
        .mockResolvedValue('janeref123');
      jest.spyOn(service, 'hashPassword').mockResolvedValue('hashedPassword');

      // After saving Brand, signup() calls generateToken(), which internally
      // calls userRepo.findOne again; return the saved Brand as the User.
      const savedBrand: Brand = {
        id: 42,
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'hashedPassword',
        role: UserRole.BRAND,
        isVerified: false,
        referralCode: 'janeref123',
        username: 'janedoe',
      } as Brand;

      brandRepo.create.mockReturnValue(savedBrand);
      brandRepo.save.mockResolvedValue(savedBrand);

      userRepo.findOne.mockResolvedValueOnce(savedBrand); // for generateToken

      const mockToken = {
        id: 7,
        token: '654321',
        user: savedBrand,
        expiresAt: new Date(Date.now() + 600000),
      };
      tokenRepo.delete.mockResolvedValue(undefined);
      tokenRepo.create.mockReturnValue(mockToken);
      tokenRepo.save.mockResolvedValue(mockToken);

      const result = await service.signup(dto, 'brand');

      expect(brandRepo.findOne).toHaveBeenCalledWith({
        where: { username: 'janedoe' },
      });
      expect(brandRepo.create).toHaveBeenCalledWith({
        role: UserRole.BRAND,
        ...dto,
        password: 'hashedPassword',
        referralCode: 'janeref123',
        username: 'janedoe',
      });
      expect(brandRepo.save).toHaveBeenCalledWith(savedBrand);
      expect(tokenRepo.create).toHaveBeenCalled();
      expect(tokenRepo.save).toHaveBeenCalledWith(mockToken);
      expect(mailerService.sendVerificationEmail).toHaveBeenCalledWith(
        'jane@example.com',
        '654321',
      );
      expect(result.message).toBe(
        'Signup successful. Please check your email to verify.',
      );
    });

    it('creates a Creator-derived user and sends verification email', async () => {
      const dto: SignupDto = {
        name: 'Alice',
        email: 'alice@example.com',
        password: 'pass',
        gender: 'Female',
      } as SignupDto;

      userRepo.findOne.mockResolvedValueOnce(null); // email check

      jest
        .spyOn(service, 'generateReferralCode')
        .mockResolvedValue('aliceref456');
      jest.spyOn(service, 'hashPassword').mockResolvedValue('hashedPass');

      const savedCreator: Creator = {
        id: 77,
        name: 'Alice',
        email: 'alice@example.com',
        password: 'hashedPass',
        role: UserRole.CREATOR,
        isVerified: false,
        referralCode: 'aliceref456',
      } as Creator;

      creatorRepo.create.mockReturnValue(savedCreator);
      creatorRepo.save.mockResolvedValue(savedCreator);

      userRepo.findOne.mockResolvedValueOnce(savedCreator); // for generateToken

      const mockToken = {
        id: 8,
        token: '999000',
        user: savedCreator,
        expiresAt: new Date(Date.now() + 600000),
      };
      tokenRepo.delete.mockResolvedValue(undefined);
      tokenRepo.create.mockReturnValue(mockToken);
      tokenRepo.save.mockResolvedValue(mockToken);

      const result = await service.signup(dto, 'creator');

      expect(creatorRepo.create).toHaveBeenCalledWith({
        role: UserRole.CREATOR,
        ...dto,
        password: 'hashedPass',
        referralCode: 'aliceref456',
      });
      expect(creatorRepo.save).toHaveBeenCalledWith(savedCreator);
      expect(mailerService.sendVerificationEmail).toHaveBeenCalledWith(
        'alice@example.com',
        '999000',
      );
      expect(result.message).toBe(
        'Signup successful. Please check your email to verify.',
      );
    });
  });

  describe('login()', () => {
    it('logs in Brand user with correct credentials and loads full entity', async () => {
      const hashed = await bcrypt.hash('mypassword', 1);
      const mockUser: User = {
        id: 1,
        name: 'Bob Brand',
        email: 'bob@example.com',
        password: hashed,
        role: UserRole.BRAND,
        isVerified: true,
      } as User;

      const mockFullBrand: Brand = {
        id: 1,
        name: 'Bob Brand',
        email: 'bob@example.com',
        password: hashed,
        role: UserRole.BRAND,
        isVerified: true,
        username: 'bobbrand',
        wallet: { id: 1, balance: 100 },
        cart: { id: 1, items: [] },
        billing: { id: 1, address: '123 Main St' },
        socialChannels: [{ id: 1, platform: 'Twitter' }],
      } as unknown as Brand;

      userRepo.findOne.mockResolvedValue(mockUser);
      brandRepo.findOne.mockResolvedValue(mockFullBrand);

      const result = await service.login('bob@example.com', 'mypassword');

      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { email: 'bob@example.com' },
      });
      expect(brandRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['wallet', 'cart', 'billing', 'socialChannels'],
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 1,
        email: 'bob@example.com',
        role: UserRole.BRAND,
      });
      expect(result).toEqual({
        accessToken: 'mocked-jwt-token',
        user: {
          id: 1,
          name: 'Bob Brand',
          email: 'bob@example.com',
          role: UserRole.BRAND,
          isVerified: true,
          username: 'bobbrand',
          wallet: { id: 1, balance: 100 },
          cart: { id: 1, items: [] },
          billing: { id: 1, address: '123 Main St' },
          socialChannels: [{ id: 1, platform: 'Twitter' }],
        },
      });
    });

    it('logs in Creator user with correct credentials and loads full entity', async () => {
      const hashed = await bcrypt.hash('mypassword', 1);
      const mockUser: User = {
        id: 2,
        name: 'Alice Creator',
        email: 'alice@example.com',
        password: hashed,
        role: UserRole.CREATOR,
        isVerified: true,
      } as User;

      const mockFullCreator: Creator = {
        id: 2,
        name: 'Alice Creator',
        email: 'alice@example.com',
        password: hashed,
        role: UserRole.CREATOR,
        isVerified: true,
        wallet: { id: 2, balance: 50 },
        card: { id: 2, number: '**** 1234' },
        media: [{ id: 1, url: 'photo.jpg' }],
        portfolio: { id: 2, description: 'My work' },
        niches: [{ id: 1, name: 'Fashion' }],
        socialChannels: [{ id: 2, platform: 'Instagram' }],
      } as unknown as Creator;

      userRepo.findOne.mockResolvedValue(mockUser);
      creatorRepo.findOne.mockResolvedValue(mockFullCreator);

      const result = await service.login('alice@example.com', 'mypassword');

      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { email: 'alice@example.com' },
      });
      expect(creatorRepo.findOne).toHaveBeenCalledWith({
        where: { id: 2 },
        relations: [
          'wallet',
          'card',
          'media',
          'portfolio',
          'niches',
          'socialChannels',
        ],
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 2,
        email: 'alice@example.com',
        role: UserRole.CREATOR,
      });
      expect(result).toEqual({
        accessToken: 'mocked-jwt-token',
        user: {
          id: 2,
          name: 'Alice Creator',
          email: 'alice@example.com',
          role: UserRole.CREATOR,
          isVerified: true,
          wallet: { id: 2, balance: 50 },
          card: { id: 2, number: '**** 1234' },
          media: [{ id: 1, url: 'photo.jpg' }],
          portfolio: { id: 2, description: 'My work' },
          niches: [{ id: 1, name: 'Fashion' }],
          socialChannels: [{ id: 2, platform: 'Instagram' }],
        },
      });
    });

    it('throws when user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);
      await expect(service.login('missing@example.com', 'x')).rejects.toThrow(
        'user not found',
      );
    });

    it('throws when password is null', async () => {
      const mockUser: User = {
        id: 2,
        name: 'No Password',
        email: 'nopass@example.com',
        password: null,
        role: UserRole.BRAND,
        isVerified: true,
      } as unknown as User;
      userRepo.findOne.mockResolvedValue(mockUser);

      await expect(
        service.login('nopass@example.com', 'password'),
      ).rejects.toThrow('Invalid credentials');
    });

    it('throws when password invalid', async () => {
      const hashed = await bcrypt.hash('correct', 1);
      const mockUser: User = {
        id: 2,
        name: 'Nope',
        email: 'nope@example.com',
        password: hashed,
        role: UserRole.BRAND,
        isVerified: true,
      } as unknown as User;
      userRepo.findOne.mockResolvedValue(mockUser);

      await expect(service.login('nope@example.com', 'wrong')).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });

  describe('verifyEmail()', () => {
    beforeEach(() => {
      mailerService.sendWelcomeEmailToBrand = jest.fn();
      mailerService.sendWelcomeEmailToCreator = jest.fn();
    });

    it('verifies email for Creator and sends welcome email with referral link', async () => {
      const mockUser: User = {
        id: 1,
        isVerified: false,
        email: 'creator@example.com',
        role: UserRole.CREATOR,
        name: 'John Doe',
        referralCode: 'ref123',
      } as User;

      const mockToken = {
        id: 10,
        token: '123456',
        expiresAt: new Date(Date.now() + 60000),
        user: mockUser,
      };

      const mockRes = makeRes();

      tokenRepo.findOne.mockResolvedValue(mockToken);
      userRepo.save.mockResolvedValue({ ...mockUser, isVerified: true });
      tokenRepo.delete.mockResolvedValue(undefined);

      const result = await service.verifyEmail('123456', mockRes);

      expect(result).toEqual({
        message: 'Email verified successfully',
        user: mockUser,
        accessToken: 'mocked-jwt-token',
      });

      expect(brandRepo.findOne).not.toHaveBeenCalled();
      expect(cartRepo.create).not.toHaveBeenCalled();
      expect(cartRepo.save).not.toHaveBeenCalled();

      expect(mailerService.sendWelcomeEmailToCreator).toHaveBeenCalledWith(
        'creator@example.com',
        'John Doe',
        expect.stringContaining(`ref=${mockUser.referralCode}`),
      );
      expect(mailerService.sendWelcomeEmailToBrand).not.toHaveBeenCalled();
      // Check cookie setting
      expect(mockRes.cookie).toHaveBeenCalledWith(
        'access_token',
        'mocked-jwt-token',
        expect.objectContaining({ httpOnly: true }),
      );
    });

    it('verifies email for Brand and sends welcome email', async () => {
      const mockUser: User = {
        id: 2,
        isVerified: false,
        email: 'brand@example.com',
        role: UserRole.BRAND,
        name: 'Acme Corp',
      } as User;

      const mockToken = {
        id: 11,
        token: '654321',
        expiresAt: new Date(Date.now() + 60000),
        user: mockUser,
      };
      const mockBrand = { id: 2, cart: null };
      const mockRes = makeRes();

      tokenRepo.findOne.mockResolvedValue(mockToken);
      userRepo.save.mockResolvedValue({ ...mockUser, isVerified: true });
      brandRepo.findOne.mockResolvedValue(mockBrand);
      cartRepo.create.mockReturnValue({ brandId: mockBrand.id });
      cartRepo.save.mockResolvedValue(undefined);
      tokenRepo.delete.mockResolvedValue(undefined);

      const result = await service.verifyEmail('654321', mockRes);

      expect(result.message).toBe('Email verified successfully');
      expect(brandRepo.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        relations: ['cart'],
      });
      expect(cartRepo.create).toHaveBeenCalledWith({ brandId: mockBrand.id });
      expect(cartRepo.save).toHaveBeenCalled();
      expect(mailerService.sendWelcomeEmailToBrand).toHaveBeenCalledWith(
        'brand@example.com',
      );
      expect(mailerService.sendWelcomeEmailToCreator).not.toHaveBeenCalled();
      // Check cookie setting
      expect(mockRes.cookie).toHaveBeenCalledWith(
        'access_token',
        'mocked-jwt-token',
        expect.objectContaining({ httpOnly: true }),
      );
    });

    it('does not create cart if brand already has one', async () => {
      const mockUser = {
        id: 3,
        email: 'brand@verified.com',
        isVerified: false,
        role: UserRole.BRAND,
      } as User;

      const mockToken = {
        id: 99,
        token: 'withcart',
        expiresAt: new Date(Date.now() + 1000),
        user: mockUser,
      };

      tokenRepo.findOne.mockResolvedValue(mockToken);
      userRepo.save.mockResolvedValue({ ...mockUser, isVerified: true });
      brandRepo.findOne.mockResolvedValue({ id: 3, cart: { id: 55 } });
      jwtService.sign.mockReturnValue('mocked-token');
      tokenRepo.delete.mockResolvedValue(undefined);

      const mockRes = makeRes();

      await service.verifyEmail('withcart', mockRes);

      expect(cartRepo.create).not.toHaveBeenCalled();
      expect(cartRepo.save).not.toHaveBeenCalled();
    });

    it('throws if token is invalid', async () => {
      tokenRepo.findOne.mockResolvedValue(null);

      await expect(
        service.verifyEmail('Invalid token', makeRes()),
      ).rejects.toThrow('Invalid token');

      expect(mailerService.sendWelcomeEmailToBrand).not.toHaveBeenCalled();
      expect(mailerService.sendWelcomeEmailToCreator).not.toHaveBeenCalled();
    });

    it('throws if token is expired', async () => {
      const expiredToken = {
        id: 12,
        token: 'expired-token',
        expiresAt: new Date(Date.now() - 60000),
        user: { id: 3 },
      };

      tokenRepo.findOne.mockResolvedValue(expiredToken);

      await expect(
        service.verifyEmail('expired-token', makeRes()),
      ).rejects.toThrow('Token expired');

      expect(mailerService.sendWelcomeEmailToBrand).not.toHaveBeenCalled();
      expect(mailerService.sendWelcomeEmailToCreator).not.toHaveBeenCalled();
    });
  });

  describe('cleanupExpiredTokens()', () => {
    it('deletes expired tokens & unverified Brand users', async () => {
      const mockUser: User = {
        id: 5,
        isVerified: false,
        role: UserRole.BRAND,
      } as User;
      const mockToken = { id: 55, user: mockUser };

      tokenRepo.find.mockResolvedValue([mockToken]);
      brandRepo.delete.mockResolvedValue(undefined);
      creatorRepo.delete.mockResolvedValue(undefined);
      userRepo.delete.mockResolvedValue(undefined);
      tokenRepo.delete.mockResolvedValue(undefined);

      await service.cleanupExpiredTokens();

      expect(tokenRepo.find).toHaveBeenCalled();
      expect(brandRepo.delete).toHaveBeenCalledWith(5);
      expect(userRepo.delete).toHaveBeenCalledWith(5);
      expect(tokenRepo.delete).toHaveBeenCalledWith(55);
    });

    it('deletes expired tokens & unverified Creator users', async () => {
      const mockUser: User = {
        id: 6,
        isVerified: false,
        role: UserRole.CREATOR,
      } as User;
      const mockToken = { id: 66, user: mockUser };

      tokenRepo.find.mockResolvedValue([mockToken]);
      brandRepo.delete.mockResolvedValue(undefined);
      creatorRepo.delete.mockResolvedValue(undefined);
      userRepo.delete.mockResolvedValue(undefined);
      tokenRepo.delete.mockResolvedValue(undefined);

      await service.cleanupExpiredTokens();

      expect(creatorRepo.delete).toHaveBeenCalledWith(6);
      expect(userRepo.delete).toHaveBeenCalledWith(6);
      expect(tokenRepo.delete).toHaveBeenCalledWith(66);
    });
  });

  describe('validateGoogleUser()', () => {
    it('returns existing user if found', async () => {
      const existing: User = { id: 11, email: 'exists@example.com' } as User;
      userRepo.findOne.mockResolvedValue(existing);

      const result = await service.validateGoogleUser({
        email: 'exists@example.com',
        firstName: 'Ex',
        lastName: 'Isting',
        avatarUrl: '',
        password: '',
        role: 'creator',
      });

      expect(result).toBe(existing);
      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { email: 'exists@example.com' },
      });
      expect(creatorRepo.create).not.toHaveBeenCalled();
      expect(brandRepo.create).not.toHaveBeenCalled();
    });

    it('creates & returns new Creator when not found', async () => {
      userRepo.findOne.mockResolvedValueOnce(null); // not found
      jest.spyOn(service, 'generateReferralCode').mockResolvedValue('newref');

      const savedCreator: Creator = {
        id: 21,
        name: 'John Doe',
        email: 'google@example.com',
        password: '',
        isVerified: true,
        role: UserRole.CREATOR,
        referralCode: 'newref',
      } as Creator;
      creatorRepo.create.mockReturnValue(savedCreator);
      creatorRepo.save.mockResolvedValue(savedCreator);

      const result = await service.validateGoogleUser({
        email: 'google@example.com',
        firstName: 'John',
        lastName: 'Doe',
        avatarUrl: '',
        password: '',
        role: 'creator',
      });

      expect(creatorRepo.create).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'google@example.com',
        password: '',
        isVerified: true,
        role: UserRole.CREATOR,
        referralCode: 'newref',
      });
      expect(result).toBe(savedCreator);
    });

    it('creates & returns new Brand with username when not found', async () => {
      userRepo.findOne.mockResolvedValueOnce(null); // not found
      brandRepo.findOne.mockResolvedValueOnce(null); // username available
      jest.spyOn(service, 'generateReferralCode').mockResolvedValue('brandref');

      const savedBrand: Brand = {
        id: 22,
        name: 'Brand Company',
        email: 'brand@example.com',
        password: '',
        isVerified: true,
        role: UserRole.BRAND,
        referralCode: 'brandref',
        username: 'brandcompany',
      } as Brand;
      brandRepo.create.mockReturnValue(savedBrand);
      brandRepo.save.mockResolvedValue(savedBrand);

      const result = await service.validateGoogleUser({
        email: 'brand@example.com',
        firstName: 'Brand',
        lastName: 'Company',
        avatarUrl: '',
        password: '',
        role: 'brand',
      });

      expect(brandRepo.findOne).toHaveBeenCalledWith({
        where: { username: 'brandcompany' },
      });
      expect(brandRepo.create).toHaveBeenCalledWith({
        name: 'Brand Company',
        email: 'brand@example.com',
        password: '',
        isVerified: true,
        role: UserRole.BRAND,
        referralCode: 'brandref',
        username: 'brandcompany',
      });
      expect(result).toBe(savedBrand);
    });

    it('throws when username already exists for brand', async () => {
      userRepo.findOne.mockResolvedValueOnce(null); // not found
      brandRepo.findOne.mockResolvedValueOnce({
        id: 1,
        username: 'existingbrand',
      } as Brand); // username taken
      jest.spyOn(service, 'generateReferralCode').mockResolvedValue('brandref');

      await expect(
        service.validateGoogleUser({
          email: 'brand@example.com',
          firstName: 'Existing',
          lastName: 'Brand',
          avatarUrl: '',
          password: '',
          role: 'brand',
        }),
      ).rejects.toThrow('Username already taken');
    });
  });

  describe('loginGoogle()', () => {
    it('returns token for existing Creator user and loads full entity', async () => {
      const mockUser: User = {
        id: 31,
        name: 'Jane G',
        email: 'jg@example.com',
        password: '',
        isVerified: true,
        role: UserRole.CREATOR,
        profileComplete: true,
      } as User;

      const mockFullCreator: Creator = {
        id: 31,
        name: 'Jane G',
        email: 'jg@example.com',
        password: '',
        isVerified: true,
        role: UserRole.CREATOR,
        wallet: { id: 31, balance: 75 },
        card: { id: 31, number: '**** 5678' },
        media: [],
        portfolio: null,
        niches: [],
        socialChannels: [],
        profileComplete: true,
      } as unknown as Creator;

      userRepo.findOne.mockResolvedValue(mockUser);
      creatorRepo.findOne.mockResolvedValue(mockFullCreator);

      const result = await service.loginGoogle(
        { email: 'jg@example.com', name: 'Jane G' },
        'creator',
      );

      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { email: 'jg@example.com' },
      });
      expect(creatorRepo.findOne).toHaveBeenCalledWith({
        where: { id: 31 },
        relations: [
          'wallet',
          'card',
          'media',
          'portfolio',
          'niches',
          'socialChannels',
        ],
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 31,
        email: 'jg@example.com',
        role: UserRole.CREATOR,
      });
      expect(result.user.email).toBe('jg@example.com');
    });

    it('creates new Brand with username when not found and loads full entity', async () => {
      userRepo.findOne.mockResolvedValueOnce(null);
      jest.spyOn(service, 'generateReferralCode').mockResolvedValue('brandref');

      const savedBrand: Brand = {
        id: 41,
        name: 'Acme',
        email: 'acme@example.com',
        password: '',
        isVerified: true,
        role: UserRole.BRAND,
        referralCode: 'brandref',
        username: 'acme',
        profileComplete: true,
      } as Brand;

      const mockFullBrand: Brand = {
        id: 41,
        name: 'Acme',
        email: 'acme@example.com',
        password: '',
        isVerified: true,
        role: UserRole.BRAND,
        referralCode: 'brandref',
        username: 'acme',
        wallet: { id: 41, balance: 200 },
        cart: { id: 41, items: [] },
        billing: null,
        socialChannels: [],
      } as unknown as Brand;

      brandRepo.create.mockReturnValue(savedBrand);
      brandRepo.save.mockResolvedValue(savedBrand);
      brandRepo.findOne.mockResolvedValue(mockFullBrand);

      const result = await service.loginGoogle(
        { email: 'acme@example.com', name: 'Acme' },
        'brand',
      );

      expect(brandRepo.create).toHaveBeenCalledWith({
        name: 'Acme',
        email: 'acme@example.com',
        password: '',
        isVerified: true,
        role: UserRole.BRAND,
        referralCode: 'brandref',
        username: 'acme',
      });
      expect(brandRepo.findOne).toHaveBeenCalledWith({
        where: { id: 41 },
        relations: ['wallet', 'cart', 'billing', 'socialChannels'],
      });
      expect(result.user.email).toBe('acme@example.com');
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 41,
        email: 'acme@example.com',
        role: UserRole.BRAND,
      });
    });

    it('creates new Creator when not found and loads full entity', async () => {
      userRepo.findOne.mockResolvedValueOnce(null);
      jest
        .spyOn(service, 'generateReferralCode')
        .mockResolvedValue('creatorref');

      const savedCreator: Creator = {
        id: 42,
        name: 'New Creator',
        email: 'newcreator@example.com',
        password: '',
        isVerified: true,
        role: UserRole.CREATOR,
        referralCode: 'creatorref',
        profileComplete: true,
      } as Creator;

      const mockFullCreator: Creator = {
        id: 42,
        name: 'New Creator',
        email: 'newcreator@example.com',
        password: '',
        isVerified: true,
        role: UserRole.CREATOR,
        referralCode: 'creatorref',
        wallet: { id: 42, balance: 0 },
        card: null,
        media: [],
        portfolio: null,
        niches: [],
        socialChannels: [],
      } as unknown as Creator;

      creatorRepo.create.mockReturnValue(savedCreator);
      creatorRepo.save.mockResolvedValue(savedCreator);
      creatorRepo.findOne.mockResolvedValue(mockFullCreator);

      const result = await service.loginGoogle(
        { email: 'newcreator@example.com', name: 'New Creator' },
        'creator',
      );

      expect(creatorRepo.create).toHaveBeenCalledWith({
        name: 'New Creator',
        email: 'newcreator@example.com',
        password: '',
        isVerified: true,
        role: UserRole.CREATOR,
        referralCode: 'creatorref',
      });
      expect(creatorRepo.findOne).toHaveBeenCalledWith({
        where: { id: 42 },
        relations: [
          'wallet',
          'card',
          'media',
          'portfolio',
          'niches',
          'socialChannels',
        ],
      });
      expect(result.user.email).toBe('newcreator@example.com');
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 42,
        email: 'newcreator@example.com',
        role: UserRole.CREATOR,
      });
    });
  });

  describe('issueTokenAfterSignup()', () => {
    it('issues token for Brand user after signup', async () => {
      const mockBaseUser: User = {
        id: 100,
        name: 'Test Brand',
        email: 'testbrand@example.com',
        role: UserRole.BRAND,
        isVerified: true,
      } as User;

      const mockFullBrand: Brand = {
        id: 100,
        name: 'Test Brand',
        email: 'testbrand@example.com',
        password: 'hashedPassword',
        role: UserRole.BRAND,
        isVerified: true,
        username: 'testbrand',
        wallet: { id: 100, balance: 0 },
        cart: { id: 100, items: [] },
        billing: null,
        socialChannels: [],
      } as unknown as Brand;

      const mockResponse = makeRes();

      userRepo.findOne.mockResolvedValue(mockBaseUser);
      brandRepo.findOne.mockResolvedValue(mockFullBrand);

      const result = await service.issueTokenAfterSignup(100, mockResponse);

      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { id: 100 } });
      expect(brandRepo.findOne).toHaveBeenCalledWith({
        where: { id: 100 },
        relations: ['wallet', 'cart', 'billing', 'socialChannels'],
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 100,
        email: 'testbrand@example.com',
        role: UserRole.BRAND,
      });
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'access_token',
        'mocked-jwt-token',
        {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          maxAge: 1000 * 60 * 60 * 24,
        },
      );
      expect(result).toEqual({
        accessToken: 'mocked-jwt-token',
        user: {
          id: 100,
          name: 'Test Brand',
          email: 'testbrand@example.com',
          role: UserRole.BRAND,
          isVerified: true,
          username: 'testbrand',
          wallet: { id: 100, balance: 0 },
          cart: { id: 100, items: [] },
          billing: null,
          socialChannels: [],
        },
      });
    });

    it('issues token for Creator user after signup', async () => {
      const mockBaseUser: User = {
        id: 200,
        name: 'Test Creator',
        email: 'testcreator@example.com',
        role: UserRole.CREATOR,
        isVerified: true,
      } as User;

      const mockFullCreator: Creator = {
        id: 200,
        name: 'Test Creator',
        email: 'testcreator@example.com',
        password: 'hashedPassword',
        role: UserRole.CREATOR,
        isVerified: true,
        wallet: { id: 200, balance: 0 },
        card: null,
        media: [],
        portfolio: null,
        niches: [],
        socialChannels: [],
      } as unknown as Creator;

      const mockResponse = makeRes();

      userRepo.findOne.mockResolvedValue(mockBaseUser);
      creatorRepo.findOne.mockResolvedValue(mockFullCreator);

      const result = await service.issueTokenAfterSignup(200, mockResponse);

      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { id: 200 } });
      expect(creatorRepo.findOne).toHaveBeenCalledWith({
        where: { id: 200 },
        relations: [
          'wallet',
          'card',
          'media',
          'portfolio',
          'niches',
          'socialChannels',
        ],
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 200,
        email: 'testcreator@example.com',
        role: UserRole.CREATOR,
      });
      expect(result).toEqual({
        accessToken: 'mocked-jwt-token',
        user: {
          id: 200,
          name: 'Test Creator',
          email: 'testcreator@example.com',
          role: UserRole.CREATOR,
          isVerified: true,
          wallet: { id: 200, balance: 0 },
          card: null,
          media: [],
          portfolio: null,
          niches: [],
          socialChannels: [],
        },
      });
    });

    it('throws when user not found', async () => {
      const mockResponse = makeRes();
      userRepo.findOne.mockResolvedValue(null);

      await expect(
        service.issueTokenAfterSignup(999, mockResponse),
      ).rejects.toThrow('User not found');
    });
  });
  describe('forgotPassword()', () => {
    it('sends password reset email when user exists', async () => {
      const mockUser: User = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: UserRole.BRAND,
      } as User;

      const mockToken = {
        id: 1,
        token: 'reset-token-123',
        user: mockUser,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      } as Token;

      userRepo.findOne.mockResolvedValue(mockUser);
      jest.spyOn(service, 'generateToken').mockResolvedValue(mockToken);
      mailerService.sendPasswordResetEmail = jest.fn();

      await service.forgotPassword('john@example.com');

      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
      expect(service.generateToken).toHaveBeenCalledWith(
        'john@example.com',
        15,
      );
      expect(mailerService.sendPasswordResetEmail).toHaveBeenCalledWith(
        mockUser,
        mockToken,
      );
    });

    it('throws NotFoundException when user does not exist', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(
        service.forgotPassword('nonexistent@example.com'),
      ).rejects.toThrow('User not found');

      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
      expect(mailerService.sendPasswordResetEmail).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword()', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'hashPassword')
        .mockResolvedValue('hashedNewPassword');
    });

    it('successfully resets password with valid token', async () => {
      const mockUser: User = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'oldHashedPassword',
        role: UserRole.BRAND,
      } as User;

      const mockToken = {
        id: 1,
        token: 'valid-reset-token',
        user: mockUser,
        expiresAt: new Date(Date.now() + 60000), // Not expired
      };

      tokenRepo.findOne.mockResolvedValue(mockToken);
      tokenRepo.delete.mockResolvedValue(undefined);
      userRepo.save.mockResolvedValue({
        ...mockUser,
        password: 'hashedNewPassword',
      });

      const result = await service.resetPassword(
        'valid-reset-token',
        'newPassword123',
      );

      expect(tokenRepo.findOne).toHaveBeenCalledWith({
        where: { token: 'valid-reset-token' },
        relations: ['user'],
      });
      expect(service.hashPassword).toHaveBeenCalledWith('newPassword123');
      expect(userRepo.save).toHaveBeenCalledWith({
        ...mockUser,
        password: 'hashedNewPassword',
      });
      expect(tokenRepo.delete).toHaveBeenCalledWith(mockToken.id);
      expect(result).toEqual({
        message:
          'Your password has been reset successfully. You can now log in.',
      });
    });

    it('throws NotFoundException when token does not exist', async () => {
      tokenRepo.findOne.mockResolvedValue(null);

      await expect(
        service.resetPassword('invalid-token', 'newPassword123'),
      ).rejects.toThrow('Token not found');

      expect(tokenRepo.findOne).toHaveBeenCalledWith({
        where: { token: 'invalid-token' },
        relations: ['user'],
      });
      expect(service.hashPassword).not.toHaveBeenCalled();
      expect(userRepo.save).not.toHaveBeenCalled();
      expect(tokenRepo.delete).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when token has no associated user', async () => {
      const mockToken = {
        id: 1,
        token: 'orphaned-token',
        user: null,
        expiresAt: new Date(Date.now() + 60000),
      };

      tokenRepo.findOne.mockResolvedValue(mockToken);

      await expect(
        service.resetPassword('orphaned-token', 'newPassword123'),
      ).rejects.toThrow('User not found');

      expect(tokenRepo.findOne).toHaveBeenCalledWith({
        where: { token: 'orphaned-token' },
        relations: ['user'],
      });
      expect(service.hashPassword).not.toHaveBeenCalled();
      expect(userRepo.save).not.toHaveBeenCalled();
      expect(tokenRepo.delete).not.toHaveBeenCalled();
    });

    it('throws BadRequestException when token is expired and deletes the token', async () => {
      const mockUser: User = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'oldHashedPassword',
        role: UserRole.BRAND,
      } as User;

      const expiredToken = {
        id: 1,
        token: 'expired-token',
        user: mockUser,
        expiresAt: new Date(Date.now() - 60000), // Expired 1 minute ago
      };

      tokenRepo.findOne.mockResolvedValue(expiredToken);
      tokenRepo.delete.mockResolvedValue(undefined);

      await expect(
        service.resetPassword('expired-token', 'newPassword123'),
      ).rejects.toThrow('Token expired');

      expect(tokenRepo.findOne).toHaveBeenCalledWith({
        where: { token: 'expired-token' },
        relations: ['user'],
      });
      expect(tokenRepo.delete).toHaveBeenCalledWith(expiredToken.id);
      expect(service.hashPassword).not.toHaveBeenCalled();
      expect(userRepo.save).not.toHaveBeenCalled();
    });

    it('deletes token even after successful password reset', async () => {
      const mockUser: User = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'oldHashedPassword',
        role: UserRole.BRAND,
      } as User;

      const mockToken = {
        id: 1,
        token: 'valid-token',
        user: mockUser,
        expiresAt: new Date(Date.now() + 60000),
      };

      tokenRepo.findOne.mockResolvedValue(mockToken);
      tokenRepo.delete.mockResolvedValue(undefined);
      userRepo.save.mockResolvedValue({
        ...mockUser,
        password: 'hashedNewPassword',
      });

      await service.resetPassword('valid-token', 'newPassword123');

      // Verify token is deleted twice - once for cleanup, once after successful reset
      expect(tokenRepo.delete).toHaveBeenCalledTimes(1);
      expect(tokenRepo.delete).toHaveBeenCalledWith(mockToken.id);
    });

    it('works with Creator user type', async () => {
      const mockCreator: Creator = {
        id: 2,
        name: 'Jane Creator',
        email: 'jane@example.com',
        password: 'oldHashedPassword',
        role: UserRole.CREATOR,
      } as Creator;

      const mockToken = {
        id: 2,
        token: 'creator-reset-token',
        user: mockCreator,
        expiresAt: new Date(Date.now() + 60000),
      };

      tokenRepo.findOne.mockResolvedValue(mockToken);
      tokenRepo.delete.mockResolvedValue(undefined);
      userRepo.save.mockResolvedValue({
        ...mockCreator,
        password: 'hashedNewPassword',
      });

      const result = await service.resetPassword(
        'creator-reset-token',
        'creatorNewPass',
      );

      expect(tokenRepo.findOne).toHaveBeenCalledWith({
        where: { token: 'creator-reset-token' },
        relations: ['user'],
      });
      expect(service.hashPassword).toHaveBeenCalledWith('creatorNewPass');
      expect(userRepo.save).toHaveBeenCalledWith({
        ...mockCreator,
        password: 'hashedNewPassword',
      });
      expect(tokenRepo.delete).toHaveBeenCalledWith(mockToken.id);
      expect(result.message).toBe(
        'Your password has been reset successfully. You can now log in.',
      );
    });
  });
});
