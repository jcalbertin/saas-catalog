import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { Tenant } from '../entities/tenant.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@ApiTags('tenants')
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tenants' })
  @ApiResponse({ status: 200, description: 'Return all tenants', type: [Tenant] })
  findAll(): Promise<Tenant[]> {
    return this.tenantsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tenant by ID' })
  @ApiResponse({ status: 200, description: 'Return the tenant', type: Tenant })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Tenant> {
    return this.tenantsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new tenant' })
  @ApiResponse({ status: 201, description: 'The tenant has been created', type: Tenant })
  create(@Body() createTenantDto: CreateTenantDto): Promise<Tenant> {
    return this.tenantsService.create(createTenantDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update tenant by ID' })
  @ApiResponse({ status: 200, description: 'The tenant has been updated', type: Tenant })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    return this.tenantsService.update(id, updateTenantDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete tenant by ID' })
  @ApiResponse({ status: 200, description: 'The tenant has been deleted' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tenantsService.remove(id);
  }
}
