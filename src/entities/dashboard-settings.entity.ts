import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Tenant } from './tenant.entity';

@Entity('dashboard_settings')
export class DashboardSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  tenant_id: number;

  @Column({ type: 'jsonb', nullable: true })
  layout: any;

  @Column({ type: 'jsonb', nullable: true })
  widgets: any;

  @Column({ length: 50, default: 'default' })
  theme: string;

  @Column({ length: 50, default: 'light' })
  color_scheme: string;

  @Column({ length: 50, default: 'overview' })
  default_view: string;

  @Column({ type: 'jsonb', nullable: true })
  favorites: any;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}