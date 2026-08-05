import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Creator } from '../../creator/entities/creator.entity';

@Entity()
export class Portfolio extends BaseEntity {
  @Column()
  creatorId: number;

  @Column({ nullable: true })
  url: string;
  @Column({ nullable: true })
  s3Key: string;

  @ManyToOne(() => Creator, (creator) => creator.portfolio, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creatorId' })
  creator: Creator;
}
