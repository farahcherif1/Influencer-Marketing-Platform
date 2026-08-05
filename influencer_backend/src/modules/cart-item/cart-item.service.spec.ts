import { Test, TestingModule } from '@nestjs/testing';
import { CartItemService } from './cart-item.service';
import { CartItem } from './entities/cart-item.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('CartItemService', () => {
  let service: CartItemService;
  let repo: jest.Mocked<Repository<CartItem>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartItemService,
        {
          provide: getRepositoryToken(CartItem),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CartItemService>(CartItemService);
    repo = module.get(getRepositoryToken(CartItem));
  });

  describe('create', () => {
    it('should create and save a new cart item', async () => {
      const cartId = 1;
      const creatorServiceId = 2;
      const mockItem = { id: 1, cartId, creatorServiceId } as CartItem;

      repo.create.mockReturnValue(mockItem);
      repo.save.mockResolvedValue(mockItem);

      const result = await service.create(cartId, creatorServiceId);

      expect(repo.create).toHaveBeenCalledWith({ cartId, creatorServiceId });
      expect(repo.save).toHaveBeenCalledWith(mockItem);
      expect(result).toEqual(mockItem);
    });
  });

  describe('remove', () => {
    it('should delete a cart item by id', async () => {
      await service.remove(1);
      expect(repo.delete).toHaveBeenCalledWith(1);
    });
  });
});
