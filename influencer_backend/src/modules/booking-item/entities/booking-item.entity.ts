import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { CreatorService } from '../../creator-service/entities/creator-service.entity';
import { BookingItemStatus } from '../../../common/enums/bookingItemStatus.enum';
import { Deliverable } from '../../deliverable/entities/deliverable.entity';

@Entity()
export class BookingItem extends BaseEntity {
  @Column('int')
  quantity: number;

  @Column('decimal')
  unitPrice: number;

  @ManyToOne(() => Booking, (booking) => booking.bookingItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @ManyToOne(
    () => CreatorService,
    (creatorService) => creatorService.bookingItems,
    { eager: true, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'creatorServiceId' })
  creatorService: CreatorService;

  @Column()
  productDescription: string;

  @Column()
  contentRequirements: string;

  @Column({ default: false })
  contentApproval?: boolean;

  @Column({ default: false })
  physicalProduct?: boolean;

  @Column({ nullable: true })
  productCost?: number;

  @Column({ default: false })
  useForAds?: boolean;

  @Column({ default: '' })
  additionalRequirements?: string;

  @Column()
  deliveryDate?: Date;

  @Column({ default: BookingItemStatus.REQUESTED })
  status: BookingItemStatus;

  @OneToMany(() => Deliverable, (deliverable) => deliverable.bookingItem)
  deliverables: Deliverable[];
}
