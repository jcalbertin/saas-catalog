import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { Tenant } from '../entities/tenant.entity';
import { Country } from '../entities/country.entity';
import { SubscriptionPlan } from '../entities/subscription-plan.entity';
import { DomainService } from './services/domain.service';
import { TenantMiddleware } from './middleware/tenant.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, Country, SubscriptionPlan])],
  controllers: [TenantsController],
  providers: [TenantsService],
  exports: [TenantsService],
})
export class TenantsModule {}