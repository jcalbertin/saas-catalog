import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Nome do produto' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Descrição do produto', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Preço do produto em centavos' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'URL da imagem principal', required: false })
  @IsString()
  @IsOptional()
  main_image?: string;

  @ApiProperty({ description: 'Lista de URLs das imagens adicionais', required: false, type: [String] })
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiProperty({ description: 'Indica se o produto está em promoção', default: false })
  @IsBoolean()
  @IsOptional()
  on_sale?: boolean;

  @ApiProperty({ description: 'Preço promocional em centavos', required: false })
  @IsNumber()
  @IsOptional()
  sale_price?: number;

  @ApiProperty({ description: 'ID da categoria do produto', required: false })
  @IsNumber()
  @IsOptional()
  category_id?: number;
}