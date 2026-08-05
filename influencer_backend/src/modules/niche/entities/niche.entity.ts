import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Creator } from '../../creator/entities/creator.entity';
@Entity()
export class Niche extends BaseEntity {
  @Column()
  name: string;

  @ManyToMany(() => Creator, (creator) => creator.niches)
  creators: Creator[];
}
