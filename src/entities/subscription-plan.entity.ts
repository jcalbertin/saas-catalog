import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Tenant } from './tenant.entity';
import { Payment } from './payment.entity';

@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column()
  price: number;

  @Column({ length: 20 })
  interval: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  features: any;

  @Column()
  product_limit: number;

  @Column()
  user_limit: number;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Tenant, tenant => tenant.subscription_plan)
  tenants: Tenant[];

  @OneToMany(() => Payment, payment => payment.subscription_plan)
  payments: Payment[];
}