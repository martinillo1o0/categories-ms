import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaginationDto } from '../dto/pagination.dto.js';
import { CategoryService } from './category.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @MessagePattern('createCategory')
  create(@Payload() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @MessagePattern('findAllCategory')
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.categoryService.findAll(paginationDto);
  }

  @MessagePattern('findOneCategory')
  findOne(@Payload() id: number) {
    return this.categoryService.findOne(id);
  }

  @MessagePattern('updateCategory')
  update(@Payload() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(updateCategoryDto.id, updateCategoryDto);
  }

  @MessagePattern('removeCategory')
  remove(@Payload() id: number) {
    return this.categoryService.remove(id);
  }
}
