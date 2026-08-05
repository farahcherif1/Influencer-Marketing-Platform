import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  last4: string;

  @Column({ name: 'expiry_month' })
  expiryMonth: number;

  @Column({ name: 'expiry_year' })
  expiryYear: number;

  @OneToOne(() => User, (user) => user.card)
  @JoinColumn({ name: 'userId' })
  user: User;
}
