import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Brand } from '../../brand/entities/brand.entity';
import { BookingItem } from '../../booking-item/entities/booking-item.entity';
import { PaymentHistory } from '../../payment-history/entities/payment-history.entity';

@Entity()
export class Booking extends BaseEntity {
  @Column()
  brandId: number;

  @Column()
  status: string;

  @Column('decimal')
  price: number;

  @ManyToOne(() => Brand, (brand) => brand.bookings)
  @JoinColumn({ name: 'brandId' })
  brand: Brand;

  @OneToMany(() => BookingItem, (bookingItem) => bookingItem.booking)
  bookingItems: BookingItem[];

  @OneToOne(() => PaymentHistory, (paymentHistory) => paymentHistory.booking)
  paymentHistory: PaymentHistory;
}
