import { Entity, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Creator } from '../..//creator/entities/creator.entity';
import { Review } from '../../../common/entities/review.entity';
import { Brand } from '../../brand/entities/brand.entity';

// the review given by the creator to the brand
@Entity('review_brand')
export class ReviewBrand extends Review {
  @Column()
  creatorId: number;

  @Column()
  brandId: number;

  @ManyToOne(() => Creator, (creator: Creator) => creator.writtenBrandReviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creatorId' })
  creator: Creator;

  @ManyToOne(() => Brand, (brand: Brand) => brand.receivedReviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'brandId' })
  brand: Brand;
}
