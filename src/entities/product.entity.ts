import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tenant } from './tenant.entity';
import { Category } from './category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  price: number;

  @Column({ type: 'text', nullable: true })
  main_image: string;

  @Column({ type: 'jsonb', nullable: true })
  images: string[];

  @Column({ default: false })
  on_sale: boolean;

  @Column({ nullable: true })
  sale_price: number;

  @Column({ nullable: true })
  category_id: number;

  @Column()
  tenant_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Category, category => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Tenant, tenant => tenant.products)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}