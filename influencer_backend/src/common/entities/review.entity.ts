import { Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export abstract class Review extends BaseEntity {
  @Column('int')
  communicationRating: number;

  @Column('int')
  timeTakenToCompleteOrderRating: number;

  @Column('int')
  serviceRating: number;

  @Column('text')
  comment: string;
}
