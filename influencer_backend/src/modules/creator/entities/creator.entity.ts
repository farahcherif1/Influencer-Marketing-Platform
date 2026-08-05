import {
  Column,
  OneToMany,
  JoinTable,
  ManyToMany,
  OneToOne,
  ChildEntity,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { CreatorService } from '../../creator-service/entities/creator-service.entity';
import { SocialChannel } from '../../social-channel/entities/social-channel.entity';
import { Niche } from '../../niche/entities/niche.entity';
import { Portfolio } from '../../portfolio/entities/portfolio.entity';
import { Media } from '../../media/entities/media.entity';
import { genderType } from '../../../common/enums/genderType.enum';
import { Wallet } from '../../wallet/entities/wallet.entity';
import { ReviewCreator } from '../../review-creator/entities/review-creator.entity';
import { ReviewBrand } from '../../review-brand/entities/review-brand.entity';
import { Language } from '../../../language/entities/language.entity';

@Index('idx_creator_country', ['country'])
@Index('idx_craeator_city', ['city'])
@Index('idx_creator_age', ['age'])
@Index('idx_creator_gender', ['gender'])
@Index('idx_creator_ethnicity', ['ethnicity'])
@ChildEntity('Creator')
export class Creator extends User {
  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true }) @Index() city?: string;

  @Column({ nullable: true }) @Index() country?: string;

  @Column({ type: 'int', nullable: true }) @Index() age?: number;

  @Column({ nullable: true })
  title?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: genderType,
    nullable: true,
  })
  gender?: genderType;

  @Column({ nullable: true })
  @Index()
  ethnicity?: string;

  @Column({ type: 'float', default: 0 })
  starRating?: number;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @ManyToMany(() => Language, (language) => language.creators, {
    cascade: true,
  })
  @JoinTable()
  languages?: Language[];

  @OneToMany(() => SocialChannel, (socialChannel) => socialChannel.creator)
  socialChannels: SocialChannel[];

  @ManyToMany(() => Niche, (niche) => niche.creators)
  @JoinTable()
  niches: Niche[];

  @OneToMany(() => Portfolio, (p) => p.creator, { cascade: true })
  portfolio: Portfolio[];

  @OneToMany(() => Media, (m) => m.creator, { cascade: true })
  media: Media[];

  @OneToMany(() => CreatorService, (cs) => cs.creator)
  creatorServices: CreatorService[];

  @OneToMany(() => ReviewCreator, (review) => review.creator)
  receivedReviews: ReviewCreator[];

  @OneToMany(() => ReviewBrand, (review) => review.creator)
  writtenBrandReviews: ReviewBrand[];

  @OneToOne(() => Wallet, (wallet) => wallet.creator, {
    cascade: true,
    nullable: true,
  })
  wallet?: Wallet;
}
