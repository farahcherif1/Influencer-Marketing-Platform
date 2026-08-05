import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
// import { Brand } from '../../brand/entities/brand.entity';

@Entity()
@Unique(['brandId']) // Ensure a brand is only referred once
export class Referral extends BaseEntity {
  @Column()
  referrerId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'referrerId' })
  referrer: User;

  @Column()
  brandId: number;

  //comment it to prevent circular dependency
  // @ManyToOne(() => Brand, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({ name: 'brandId' })
  // brand: Brand;

  @Column({ default: false })
  isRewarded: boolean;

  @Column({ type: 'timestamp', nullable: true })
  rewardDate?: Date;
}
