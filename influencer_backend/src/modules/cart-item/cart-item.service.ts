import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepo: Repository<CartItem>,
  ) {}

  async create(cartId: number, creatorServiceId: number): Promise<CartItem> {
    const item = this.cartItemRepo.create({ cartId, creatorServiceId });
    return this.cartItemRepo.save(item);
  }

  async remove(id: number): Promise<void> {
    await this.cartItemRepo.delete(id);
  }
}
