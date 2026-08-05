import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  Index,
} from 'typeorm';
import { User } from '../user/entities/user.entity';

@Entity()
@Index('idx_creator_category', ['name'])
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  name: string;

  @Column()
  label: string;

  @ManyToMany(() => User, (user) => user.categories)
  users: User[];
}
