import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Brand } from '../../brand/entities/brand.entity';
import { Review } from '../../../common/entities/review.entity';
import { Creator } from '../../creator/entities/creator.entity';

// the review given by the brand to the creator
@Entity('review_creator')
export class ReviewCreator extends Review {
  @Column()
  creatorId: number;

  @Column()
  brandId: number;

  @ManyToOne(() => Brand, (brand) => brand.writtenCreatorReviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'brandId' })
  brand: Brand;

  @ManyToOne(() => Creator, (creator) => creator.receivedReviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creatorId' })
  creator: Creator;
}
