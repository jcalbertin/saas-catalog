import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Tenant } from './tenant.entity';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 3 })
  code: string;

  @Column({ length: 3 })
  currency: string;

  @Column({ length: 10, nullable: true })
  currency_symbol: string;

  @Column({ type: 'jsonb', nullable: true })
  supported_payment_methods: any;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Tenant, tenant => tenant.country)
  tenants: Tenant[];
}