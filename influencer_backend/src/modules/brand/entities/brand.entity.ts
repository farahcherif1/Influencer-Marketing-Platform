import { ChildEntity, Column, OneToOne, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { SocialChannel } from '../../social-channel/entities/social-channel.entity';
import { Billing } from '../../billing/entities/billing.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { Wallet } from '../../../modules/wallet/entities/wallet.entity';
import { ReviewBrand } from '../../review-brand/entities/review-brand.entity';
import { ReviewCreator } from '../../review-creator/entities/review-creator.entity';

@ChildEntity()
export class Brand extends User {
  @Column({ nullable: true })
  brandName?: string;

  @Column({ nullable: true })
  brandRole?: string;

  @Column({ nullable: true })
  logoUrl?: string;

  @Column({ nullable: true })
  coverPhotoUrl?: string;

  @Column({ nullable: true })
  logoKey?: string;

  @Column({ nullable: true })
  coverKey?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  industry?: string;

  @Column('simple-array', { nullable: true })
  targetPlatforms?: string[];

  @Column({ type: 'int', nullable: true })
  piecesOfContentPerMonth?: number;

  @Column({ type: 'float', nullable: true })
  annualBudget?: number;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  country?: string;

  @OneToMany(() => Booking, (booking) => booking.brand)
  bookings: Booking[];

  @OneToMany(() => SocialChannel, (socialChannel) => socialChannel.brand)
  socialChannels: SocialChannel[];

  @OneToOne(() => Billing, (billing) => billing.brand)
  billing: Billing;

  @OneToOne(() => Cart, (cart) => cart.brand)
  cart: Cart;

  @OneToMany(() => ReviewCreator, (review) => review.brand)
  writtenCreatorReviews: ReviewCreator[];

  @OneToMany(() => ReviewBrand, (review) => review.brand)
  receivedReviews: ReviewBrand[];

  @OneToOne(() => Wallet, (wallet) => wallet.brand, {
    cascade: true,
    nullable: true,
  })
  wallet?: Wallet;
}
