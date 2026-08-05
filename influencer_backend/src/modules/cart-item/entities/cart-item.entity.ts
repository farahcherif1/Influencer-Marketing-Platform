import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { CreatorService } from '../../creator-service/entities/creator-service.entity';
import { Cart } from '../../../modules/cart/entities/cart.entity';

@Entity()
export class CartItem extends BaseEntity {
  @ManyToOne(() => Cart, (cart) => cart.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @Column()
  cartId: number;

  @ManyToOne(() => CreatorService, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creatorServiceId' })
  creatorService: CreatorService;

  @Column()
  creatorServiceId: number;
}
