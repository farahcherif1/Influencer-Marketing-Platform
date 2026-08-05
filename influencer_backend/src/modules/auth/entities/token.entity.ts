import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../../modules/user/entities/user.entity';

@Entity()
export class Token extends BaseEntity {
  @Column()
  token: string;

  @OneToOne(() => User, (user) => user.token, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ type: 'timestamp' })
  expiresAt: Date;
}
