import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Brand } from '../../brand/entities/brand.entity';
import { PaymentHistory } from '../../payment-history/entities/payment-history.entity';

@Entity()
export class Billing extends BaseEntity {
  @Column()
  brandId: number;

  @Column('int')
  year: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalSpend: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPending: number;

  @Column('decimal', { precision: 10, scale: 2 })
  balance: number;

  @OneToOne(() => Brand, (brand) => brand.billing, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brandId' })
  brand: Brand;

  @OneToMany(() => PaymentHistory, (paymentHistory) => paymentHistory.billing)
  paymentHistories: PaymentHistory[];
}
