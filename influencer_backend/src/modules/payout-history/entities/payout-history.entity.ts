import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Wallet } from '../../wallet/entities/wallet.entity';

export enum PayoutStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

@Entity()
export class PayoutHistory extends BaseEntity {
  @ManyToOne(() => Wallet, (wallet) => wallet.payouts, { onDelete: 'CASCADE' })
  wallet: Wallet;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'enum', enum: PayoutStatus })
  status: PayoutStatus;

  @Column()
  paymentMethod: string;

  @Column()
  transactionId: string;

  @Column()
  requestedAt: Date;

  @Column({ nullable: true })
  processedAt?: Date;
}
