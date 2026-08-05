import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { ObjectLiteral, Repository } from 'typeorm';

type MockRepository<T extends ObjectLiteral> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepository = <
  T extends ObjectLiteral,
>(): MockRepository<T> => ({
  find: jest.fn(),
});

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepo: MockRepository<Category>;

  beforeEach(async () => {
    categoryRepo = createMockRepository<Category>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: categoryRepo,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const expectedCategories = [{ id: 1, name: 'Tech' }];
      categoryRepo.find!.mockResolvedValue(expectedCategories);

      const result = await service.findAll();

      expect(result).toEqual(expectedCategories);
      expect(categoryRepo.find).toHaveBeenCalledTimes(1);
    });
  });
});
