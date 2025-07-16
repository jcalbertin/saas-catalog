import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Nome da categoria' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Descrição da categoria', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}