import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service.js';
import { PaginationDto } from '../dto/pagination.dto.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const totalCategories = await this.prisma.category.count();
    const lastPage = Math.ceil(totalCategories / limit);

    return {
      data: await this.prisma.category.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      meta: {
        total: totalCategories,
        page,
        lastPage,
      },
    };
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Category with id ${id} not found`,
      });
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { id: _, ...data } = updateCategoryDto;

    await this.findOne(id);
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.category.delete({
      where: { id },
    });

    return {
      status: 200,
      msg: 'Category deleted successfully',
    };
  }

  async validateCategories(ids: number[]) {
    const uniqueIds = Array.from(new Set(ids));
    const categories = await this.prisma.category.findMany({
      where: { id: { in: uniqueIds } },
    });

    if (categories.length !== uniqueIds.length) {
      const foundIds = new Set(categories.map((category: { id: number }) => category.id));
      const missingIds = uniqueIds.filter((id) => !foundIds.has(id));
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Categories not found: ${missingIds.join(', ')}`,
      });
    }

    return categories;
  }
}
