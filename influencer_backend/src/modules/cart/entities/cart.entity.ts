import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Brand } from '../../brand/entities/brand.entity';
import { CartItem } from '../../cart-item/entities/cart-item.entity';
@Entity()
export class Cart extends BaseEntity {
  @Column()
  brandId: number;

  @OneToOne(() => Brand, (brand) => brand.cart, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'brandId' })
  brand: Brand;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  cartItems: CartItem[];
}
