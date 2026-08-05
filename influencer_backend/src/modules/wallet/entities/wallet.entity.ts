import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Creator } from '../../creator/entities/creator.entity';
import { Brand } from '../../brand/entities/brand.entity';
import { PayoutHistory } from '../../payout-history/entities/payout-history.entity';

@Entity()
export class Wallet extends BaseEntity {
  @Column({ type: 'float', default: 0 })
  availableBalance: number;

  @Column({ type: 'float', default: 0 })
  pendingBalance: number;

  @Column({ type: 'float', default: 0 })
  totalEarnings: number;

  @OneToOne(() => Creator, (creator) => creator.wallet, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  creator?: Creator;

  @OneToOne(() => Brand, (brand) => brand.wallet, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  brand?: Brand;

  @OneToMany(() => PayoutHistory, (payout) => payout.wallet)
  payouts: PayoutHistory[];
}
