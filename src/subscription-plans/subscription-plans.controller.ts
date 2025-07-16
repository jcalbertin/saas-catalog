import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { Public, Roles } from '../auth/decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubscriptionPlansService } from './subscription-plans.service';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';

@ApiTags('subscription-plans')
@Controller('subscription-plans')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubscriptionPlansController {
  constructor(private readonly subscriptionPlansService: SubscriptionPlansService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new subscription plan' })
  @ApiResponse({ status: 201, description: 'The plan has been successfully created.' })
  create(@Body() createSubscriptionPlanDto: CreateSubscriptionPlanDto) {
    return this.subscriptionPlansService.create(createSubscriptionPlanDto);
  }

  @Get('public')
  @Public()
  @ApiOperation({ summary: 'Get all active subscription plans (public access)' })
  @ApiResponse({ status: 200, description: 'List of active subscription plans' })
  findActivePublic() {
    return this.subscriptionPlansService.findAll(true);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all subscription plans (admin only)' })
  @ApiResponse({ status: 200, description: 'List of subscription plans' })
  findAll(@Query('active') active?: boolean) {
    return this.subscriptionPlansService.findAll(active);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a subscription plan by id' })
  findOne(@Param('id') id: string) {
    return this.subscriptionPlansService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update a subscription plan' })
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionPlanDto: UpdateSubscriptionPlanDto,
  ) {
    return this.subscriptionPlansService.update(+id, updateSubscriptionPlanDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a subscription plan' })
  remove(@Param('id') id: string) {
    return this.subscriptionPlansService.remove(+id);
  }

  @Patch(':id/deactivate')
  @Roles('admin')
  @ApiOperation({ summary: 'Deactivate a subscription plan' })
  @ApiResponse({ status: 200, description: 'The plan has been successfully deactivated.' })
  deactivate(@Param('id') id: string) {
    return this.subscriptionPlansService.deactivate(+id);
  }
}
