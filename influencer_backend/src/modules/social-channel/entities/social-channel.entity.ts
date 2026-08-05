import { Entity, Column, JoinColumn, ManyToOne, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ContentType } from '../../../common/enums/contentType.enum';
import { Creator } from '../../creator/entities/creator.entity';
import { Brand } from '../../brand/entities/brand.entity';

@Index('idx_creator_followers', ['followers'])
@Index('idx_creator_contentType', ['platform'])
@Entity()
export class SocialChannel extends BaseEntity {
  @Column({ type: 'enum', enum: ContentType })
  platform: ContentType;

  @Column({ nullable: true })
  url?: string;

  @Column('int', { nullable: true })
  followers: number;

  @Column({ nullable: true })
  creatorId?: number;

  @Column({ nullable: true })
  brandId?: number;

  @Column({ nullable: true })
  username: string;

  @ManyToOne(() => Creator, (creator) => creator.socialChannels, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creatorId' })
  creator: Creator;

  @ManyToOne(() => Brand, (brand: Brand) => brand.socialChannels, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'brandId' })
  brand: Brand;
}
