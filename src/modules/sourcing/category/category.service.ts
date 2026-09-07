import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../../database/entities/category.entity';
import { ItemType } from '../../../database/entities/item-type.entity';
import { CreateCategoryDto } from './create-category.dto';
import { UpdateCategoryDto } from './update-category.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

import { instanceToPlain } from 'class-transformer';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private repo: Repository<Category>,
    @InjectRepository(ItemType) private typeRepo: Repository<ItemType>
  ) {}

  async create(dto: CreateCategoryDto) {
    const { type_id, ...rest } = dto;
    const type = await this.typeRepo.findOne({ where: { id: type_id } });
    if (!type) throw new BadRequestException(`ItemType ${type_id} not found`);
    
    return this.repo.save(this.repo.create({ ...rest, type }));
  }

  async findAll(query: PaginationDto): Promise<PaginatedResult<any>> {
    const { page, limit } = query;
    const [data, total] = await this.repo.createQueryBuilder('category')
      .leftJoinAndSelect('category.type', 'type')
      .loadRelationCountAndMap('category.referenceCount', 'category.models')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    
    const mappedData = data.map(item => ({
      ...instanceToPlain(item),
      referenceCount: (item as any).referenceCount
    }));
    return { data: mappedData, meta: { page, limit, total, lastPage: Math.ceil(total / limit) } };
  }

  async findOne(id: number) {
    const category = await this.repo.findOne({ where: { id }, relations: ['type'] });
    if (!category) throw new NotFoundException(`Category ${id} not found`);
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const { type_id, ...rest } = dto;
    const category = await this.findOne(id);
    Object.assign(category, rest);
    
    if (type_id !== undefined) {
      const type = await this.typeRepo.findOne({ where: { id: type_id } });
      if (!type) throw new BadRequestException(`ItemType ${type_id} not found`);
      category.type = type;
    }
    
    return this.repo.save(category);
  }

  async remove(id: number) {
    await this.repo.remove(await this.findOne(id));
  }
}

