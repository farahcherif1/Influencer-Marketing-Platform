import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,
  ) {}

  async getCartWithFullDetails(brandId: number) {
    return this.cartRepo.findOne({
      where: {
        brandId,
      },
      relations: [
        'cartItems',
        'cartItems.creatorService',
        'cartItems.creatorService.creator',
        'cartItems.creatorService.creator.media',
        'cartItems.creatorService.service',
      ],
    });
  }

  async findAllByBrand(brandId: number) {
    return this.cartRepo.find({
      where: {
        brand: { id: brandId },
      },
      relations: ['cartItems'],
    });
  }
}
