import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Creator } from '../../creator/entities/creator.entity';
import { MediaType } from '../../../common/enums/mediaType.enum';

@Entity()
export class Media extends BaseEntity {
  @Column()
  creatorId: number;

  @Column()
  url: string;

  @Column({ type: 'enum', enum: MediaType })
  type: MediaType;

  @Column({ nullable: true })
  s3Key: string;

  @ManyToOne(() => Creator, (creator) => creator.media, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creatorId' })
  creator: Creator;
}
