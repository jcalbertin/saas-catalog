import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Category } from '../entities/category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@ApiTags("categories")
@Controller("categories")
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: "Get all categories for the current tenant" })
  @ApiResponse({
    status: 200,
    description: "Return all categories.",
    type: [Category],
  })
  findAll(@Request() req) {
    return this.categoriesService.findAll(req.user.tenantId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a category by ID" })
  @ApiResponse({
    status: 200,
    description: "Return the category.",
    type: Category,
  })
  @ApiResponse({ status: 404, description: "Category not found." })
  findOne(@Param("id") id: string, @Request() req) {
    return this.categoriesService.findOne(+id, req.user.tenantId);
  }

  @Post()
  @ApiOperation({ summary: "Create a new category" })
  @ApiResponse({
    status: 201,
    description: "The category has been created.",
    type: Category,
  })
  create(@Body() createCategoryDto: CreateCategoryDto, @Request() req) {
    return this.categoriesService.create(createCategoryDto, req.user.tenantId);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a category" })
  @ApiResponse({
    status: 200,
    description: "The category has been updated.",
    type: Category,
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({ status: 404, description: "Category not found." })
  update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Request() req
  ) {
    return this.categoriesService.update(
      +id,
      updateCategoryDto,
      req.user.tenantId
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a category" })
  @ApiResponse({ status: 200, description: "The category has been deleted." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({ status: 404, description: "Category not found." })
  remove(@Param("id") id: string, @Request() req) {
    return this.categoriesService.remove(+id, req.user.tenantId);
  }
}