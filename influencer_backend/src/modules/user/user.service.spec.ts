import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByUsername', () => {
    it('should return user role if user exists', async () => {
      const user = { username: 'john', role: 'brand' } as User;
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findByUsername('john');
      expect(result).toEqual({ role: 'brand' });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'john' },
      });
    });

    it('should throw an error if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findByUsername('unknown')).rejects.toThrow(
        'User not found',
      );
    });
  });
});
