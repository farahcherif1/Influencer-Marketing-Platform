import {
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Entity,
  Index,
} from 'typeorm';
import { Creator } from '../../creator/entities/creator.entity';
import { Service } from '../../service/entities/service.entity';
import { BookingItem } from '../../booking-item/entities/booking-item.entity';
import { DurationUnit } from '../../../common/enums/durationUnit.enum';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity()
@Index('idx_creator_price', ['price'])
export class CreatorService extends BaseEntity {
  @Column()
  creatorId: number;

  @Column()
  serviceId: number;

  @ManyToOne(() => Creator, (creator) => creator.creatorServices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creatorId' })
  creator: Creator;

  @ManyToOne(() => Service, (service) => service.creatorServices)
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @Column()
  @Index()
  price: number;

  @Column('text')
  description: string;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  duration?: number;

  @Column({ nullable: true })
  durationUnit?: DurationUnit;

  @OneToMany(() => BookingItem, (bookingItem) => bookingItem.creatorService)
  bookingItems: BookingItem[];
}
