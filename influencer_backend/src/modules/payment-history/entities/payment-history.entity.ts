import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { Billing } from '../../billing/entities/billing.entity';

@Entity()
export class PaymentHistory extends BaseEntity {
  @Column({ nullable: true })
  bookingId?: number;

  @Column({ nullable: true })
  billingId?: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  paymentMethod?: string;

  @Column({ type: 'enum', enum: ['Pending', 'Completed', 'Failed'] })
  status: 'Pending' | 'Completed' | 'Failed';

  @Column()
  date: Date;

  @Column({ nullable: true })
  details?: string;

  @Column({ type: 'enum', enum: ['Spend', 'TopUp'] })
  type: 'Spend' | 'TopUp';

  @OneToOne(() => Booking, (booking) => booking.paymentHistory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @ManyToOne(() => Billing, (billing) => billing.paymentHistories)
  @JoinColumn({ name: 'billingId' })
  billing: Billing;
}
