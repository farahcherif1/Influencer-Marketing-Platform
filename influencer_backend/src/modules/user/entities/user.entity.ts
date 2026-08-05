import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  TableInheritance,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { IsEmail } from 'class-validator';
import { UserRole } from '../../../common/enums/user-role.enum';
import { Token } from '../../auth/entities/token.entity';
import { Notification } from '../../notification/entities/notification.entity';
import { Message } from '../../message/entities/message.entity';
import { Referral } from '../../../modules/referral/entities/referral.entity';
import { Category } from '../../category/category.entity';
import { Card } from '../../card/entities/card.entity';

@Entity('user')
@TableInheritance({
  column: { type: 'varchar', name: 'type', default: 'user' },
})
export abstract class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: true,
  })
  role: UserRole;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  profileComplete: boolean;

  @Column({ unique: true, nullable: true })
  referralCode: string;

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages: Message[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => Referral, (referral) => referral.referrer)
  referrals: Referral[];

  @OneToOne(() => Token, (token) => token.user)
  token: Token;

  @ManyToMany(() => Category, (category) => category.users, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  categories: Category[];

  @OneToOne(() => Card, (card) => card.user, { cascade: true, eager: true })
  @JoinColumn()
  card: Card;
}
