import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Country } from './country.entity';
import { SubscriptionPlan } from './subscription-plan.entity';
import { User } from './user.entity';
import { Category } from './category.entity';
import { Product } from './product.entity';
import { Payment } from './payment.entity';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 100, unique: true })
  subdomain: string;

  @Column({ length: 255 })
  store_name: string;

  @Column()
  country_id: number;

  @Column({ nullable: true })
  subscription_plan_id: number;

  @Column({ length: 100, nullable: true })
  business_document: string;

  @Column({ length: 50, nullable: true })
  whatsapp_number: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 100, nullable: true })
  state: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Country, country => country.tenants)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ManyToOne(() => SubscriptionPlan, plan => plan.tenants)
  @JoinColumn({ name: 'subscription_plan_id' })
  subscription_plan: SubscriptionPlan;

  @OneToMany(() => User, user => user.tenant)
  users: User[];

  @OneToMany(() => Category, category => category.tenant)
  categories: Category[];

  @OneToMany(() => Product, product => product.tenant)
  products: Product[];

  @OneToMany(() => Payment, payment => payment.tenant)
  payments: Payment[];
}