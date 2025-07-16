import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tenant } from './tenant.entity';
import { SubscriptionPlan } from './subscription-plan.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tenant_id: number;

  @Column()
  subscription_plan_id: number;

  @Column()
  amount: number;

  @Column({ length: 3 })
  currency: string;

  @Column({ length: 50 })
  payment_method: string;

  @Column({ length: 20 })
  status: string;

  @Column({ length: 255, nullable: true })
  transaction_id: string;

  @Column({ type: 'jsonb', nullable: true })
  payment_data: any;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Tenant, tenant => tenant.payments)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @ManyToOne(() => SubscriptionPlan, plan => plan.payments)
  @JoinColumn({ name: 'subscription_plan_id' })
  subscription_plan: SubscriptionPlan;
}