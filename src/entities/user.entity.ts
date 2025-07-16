import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tenant } from './tenant.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  username: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 100, nullable: true })
  first_name: string;

  @Column({ length: 100, nullable: true })
  last_name: string;

  @Column({ type: 'text', default: 'user' })
  role: string;

  @Column()
  tenant_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Tenant, tenant => tenant.users)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}