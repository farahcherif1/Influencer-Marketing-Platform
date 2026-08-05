import { Test, TestingModule } from '@nestjs/testing';
import { RemoveOptions, Repository, SaveOptions } from 'typeorm';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { ContentType } from '../../common/enums/contentType.enum';
import { Creator } from '../creator/entities/creator.entity';
import { CreatorService as CreatorServiceEntity } from 'modules/creator-service/entities/creator-service.entity';
import { Service } from '../service/entities/service.entity';
import { Brand } from '../brand/entities/brand.entity';
import { CartItem } from '../cart-item/entities/cart-item.entity';

class MockCart extends Cart {
  softRemove = jest.fn();
  recover = jest.fn();
  reload = jest.fn();
  save = jest.fn();
  remove = jest.fn();
  hasId = jest.fn(() => true);

  constructor(init?: Partial<Cart>) {
    super();
    Object.assign(this, init);
  }
}

describe('CartService', () => {
  let service: CartService;
  let cartRepo: jest.Mocked<Repository<Cart>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: 'CartRepository',
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartRepo = module.get('CartRepository');
  });

  describe('getCartWithFullDetails', () => {
    it('should return the active cart with full relations for the given brandId', async () => {
      const brandId = 1;

      const mockCart: Cart = {
        id: 1,
        brandId,
        createdAt: new Date(),
        updatedAt: new Date(),
        cartItems: [
          {
            id: 1,
            cart: { id: 1 } as Cart,
            creatorService: {
              id: 1,
              price: 200,
              description: 'Instagram Story + Post',
              duration: 60,
              creatorId: 1,
              serviceId: 1,
              creator: { id: 1, name: 'test' } as Creator,
              service: {
                id: 1,
                name: 'Instagram Story',
                platform: ContentType.INSTAGRAM,
              } as Service,
            } as CreatorServiceEntity,
          } as CartItem,
        ],
        brand: new Brand(),
        hasId: function (): boolean {
          throw new Error('Function not implemented.');
        },
        save: function (options?: SaveOptions): Promise<Cart> {
          throw new Error('Function not implemented.');
        },
        remove: function (options?: RemoveOptions): Promise<Cart> {
          throw new Error('Function not implemented.');
        },
        softRemove: function (options?: SaveOptions): Promise<Cart> {
          throw new Error('Function not implemented.');
        },
        recover: function (options?: SaveOptions): Promise<Cart> {
          throw new Error('Function not implemented.');
        },
        reload: function (): Promise<void> {
          throw new Error('Function not implemented.');
        },
      };

      cartRepo.findOne.mockResolvedValue(mockCart);

      const result = await service.getCartWithFullDetails(brandId);

      expect(cartRepo.findOne).toHaveBeenCalledWith({
        where: { brandId },
        relations: [
          'cartItems',
          'cartItems.creatorService',
          'cartItems.creatorService.creator',
          'cartItems.creatorService.creator.media',
          'cartItems.creatorService.service',
        ],
      });

      expect(result).toEqual(mockCart);
    });
  });

  describe('findAllByBrand', () => {
    it('should return all carts for brand', async () => {
      const mockCarts: Cart[] = [
        new MockCart({
          id: 1,
          brandId: 1,
          cartItems: [],
          brand: { id: 1 } as Brand, // This can also be strictly typed if Brand entity is imported
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      cartRepo.find.mockResolvedValue(mockCarts);

      const result = await service.findAllByBrand(1);
      expect(result).toEqual(mockCarts);
      expect(cartRepo.find).toHaveBeenCalledWith({
        where: {
          brand: { id: 1 },
        },
        relations: ['cartItems'],
      });
    });
  });
});
