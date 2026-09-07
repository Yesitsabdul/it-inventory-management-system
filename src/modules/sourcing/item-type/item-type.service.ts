import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemType } from '../../../database/entities/item-type.entity';
import { CreateItemTypeDto } from './create-item-type.dto';
import { UpdateItemTypeDto } from './update-item-type.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

@Injectable()
export class ItemTypeService {
  constructor(@InjectRepository(ItemType) private repo: Repository<ItemType>) {}

  create(dto: CreateItemTypeDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async findAll(query: PaginationDto): Promise<PaginatedResult<any>> {
    const { page, limit } = query;
    const [data, total] = await this.repo.createQueryBuilder('item_type')
      .loadRelationCountAndMap('item_type.referenceCount', 'item_type.categories')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    
    const mappedData = data.map(item => ({
      id: item.id,
      name: item.name,
      referenceCount: (item as any).referenceCount
    }));
    return { data: mappedData, meta: { page, limit, total, lastPage: Math.ceil(total / limit) } };
  }

  async findOne(id: number) {
    const itemType = await this.repo.findOne({ where: { id } });
    if (!itemType) throw new NotFoundException(`ItemType ${id} not found`);
    return itemType;
  }

  async update(id: number, dto: UpdateItemTypeDto) {
    const itemType = await this.findOne(id);
    Object.assign(itemType, dto);
    return this.repo.save(itemType);
  }

  async remove(id: number) {
    await this.repo.remove(await this.findOne(id));
  }
}
