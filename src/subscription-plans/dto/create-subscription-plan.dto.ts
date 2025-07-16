import { IsString, IsNumber, IsOptional, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionPlanDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  interval: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  features?: any;

  @ApiProperty()
  @IsNumber()
  product_limit: number;

  @ApiProperty()
  @IsNumber()
  user_limit: number;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
