import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BookingItem } from '../../booking-item/entities/booking-item.entity';

@Entity()
export class Deliverable extends BaseEntity {
  @Column({ nullable: true })
  bookingItemId: number;

  @Column('jsonb', { nullable: true })
  files?: { fileName: string; key: string }[];

  @Column('text', { array: true, nullable: true })
  links?: string[];

  @Column({ default: false })
  approved?: boolean;

  @ManyToOne(() => BookingItem, (bookingItem) => bookingItem.deliverables, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bookingItemId' })
  bookingItem: BookingItem;
}
