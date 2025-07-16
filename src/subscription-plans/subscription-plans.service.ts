import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlan } from '../entities/subscription-plan.entity';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';

@Injectable()
export class SubscriptionPlansService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private subscriptionPlanRepository: Repository<SubscriptionPlan>,
  ) {}

  create(createSubscriptionPlanDto: CreateSubscriptionPlanDto) {
    const plan = this.subscriptionPlanRepository.create(createSubscriptionPlanDto);
    return this.subscriptionPlanRepository.save(plan);
  }

  findAll(activeOnly: boolean = false) {
    return this.subscriptionPlanRepository.find({
      where: activeOnly ? { active: true } : undefined,
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: number) {
    const plan = await this.subscriptionPlanRepository.findOne({
      where: { id },
      relations: ['tenants'],
    });
    
    if (!plan) {
      throw new NotFoundException(`Subscription plan with ID ${id} not found`);
    }
    
    return plan;
  }

  async update(id: number, updateSubscriptionPlanDto: UpdateSubscriptionPlanDto) {
    const plan = await this.findOne(id);
    Object.assign(plan, updateSubscriptionPlanDto);
    return this.subscriptionPlanRepository.save(plan);
  }

  async remove(id: number) {
    const plan = await this.findOne(id);
    return this.subscriptionPlanRepository.remove(plan);
  }

  async deactivate(id: number) {
    const plan = await this.findOne(id);
    plan.active = false;
    return this.subscriptionPlanRepository.save(plan);
  }
}
