import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateTenantDto {
  @ApiProperty({ description: 'Name of the tenant' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Subdomain for tenant store' })
  @IsString()
  @IsNotEmpty()
  subdomain: string;

  @ApiProperty({ description: 'Store name' })
  @IsString()
  @IsNotEmpty()
  store_name: string;

  @ApiProperty({ description: 'Country ID' })
  @IsNumber()
  @IsNotEmpty()
  country_id: number;

  @ApiProperty({ description: 'Subscription plan ID', required: false })
  @IsNumber()
  @IsOptional()
  subscription_plan_id?: number;

  @ApiProperty({ description: 'Business document (CNPJ/CPF)', required: false })
  @IsString()
  @IsOptional()
  business_document?: string;

  @ApiProperty({ description: 'WhatsApp number', required: false })
  @IsString()
  @IsOptional()
  whatsapp_number?: string;

  @ApiProperty({ description: 'Address', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ description: 'City', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ description: 'State', required: false })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ description: 'Active status', default: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean = true;
}
