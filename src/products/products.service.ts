import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Between } from 'typeorm';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { FindProductsDto } from './dto/find-products.dto';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(tenantId: number, filters: FindProductsDto): Promise<PaginatedResult<Product>> {
    const { page = 1, limit = 10, search, categoryId, sortBy = 'created_at', sortOrder = 'DESC', minPrice, maxPrice } = filters;
    
    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.tenant_id = :tenantId', { tenantId });

    // Aplicar filtros
    if (search) {
      queryBuilder.andWhere('(product.name ILIKE :search OR product.description ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId });
    }

    if (minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    // Ordenação
    queryBuilder.orderBy(`product.${sortBy}`, sortOrder);

    // Paginação
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: number, tenantId: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id, tenant_id: tenantId },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async create(createProductDto: CreateProductDto, tenantId: number): Promise<Product> {
    const product = this.productRepository.create({
      ...createProductDto,
      tenant_id: tenantId,
    });

    return await this.productRepository.save(product);
  }

  async update(id: number, updateProductDto: UpdateProductDto, tenantId: number): Promise<Product> {
    const product = await this.findOne(id, tenantId);

    if (product.tenant_id !== tenantId) {
      throw new ForbiddenException('You do not have permission to update this product');
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: number, tenantId: number): Promise<void> {
    const product = await this.findOne(id, tenantId);

    if (product.tenant_id !== tenantId) {
      throw new ForbiddenException('You do not have permission to delete this product');
    }

    await this.productRepository.remove(product);
  }
}