import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(tenantId: number): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { tenant_id: tenantId },
      relations: ['products'],
    });
  }

  async findOne(id: number, tenantId: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id, tenant_id: tenantId },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto, tenantId: number): Promise<Category> {
    const category = this.categoryRepository.create({
      ...createCategoryDto,
      tenant_id: tenantId,
    });

    return this.categoryRepository.save(category);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto, tenantId: number): Promise<Category> {
    const category = await this.findOne(id, tenantId);

    if (category.tenant_id !== tenantId) {
      throw new ForbiddenException('You do not have permission to update this category');
    }

    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: number, tenantId: number): Promise<void> {
    const category = await this.findOne(id, tenantId);

    if (category.tenant_id !== tenantId) {
      throw new ForbiddenException('You do not have permission to delete this category');
    }

    await this.categoryRepository.remove(category);
  }
}