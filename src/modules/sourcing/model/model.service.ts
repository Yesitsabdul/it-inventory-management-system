import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Model } from '../../../database/entities/model.entity';
import { Manufacturer } from '../../../database/entities/manufacturer.entity';
import { Category } from '../../../database/entities/category.entity';
import { CreateModelDto } from './create-model.dto';
import { UpdateModelDto } from './update-model.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

import { instanceToPlain } from 'class-transformer';

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(Model) private repo: Repository<Model>,
    @InjectRepository(Manufacturer) private mfgRepo: Repository<Manufacturer>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateModelDto) {
    const { manufacturer_id, category_id, ...rest } = dto;

    let manufacturer: Manufacturer | undefined;
    if (manufacturer_id) {
      const found = await this.mfgRepo.findOne({ where: { id: manufacturer_id } });
      if (!found) throw new BadRequestException(`Manufacturer ${manufacturer_id} not found`);
      manufacturer = found;
    }

    let category: Category | undefined;
    if (category_id) {
      const found = await this.categoryRepo.findOne({ where: { id: category_id } });
      if (!found) throw new BadRequestException(`Category ${category_id} not found`);
      category = found;
    }

    let unique_id = rest.unique_id;
    if (!unique_id) {
      const crypto = require('crypto');
      unique_id = 'MOD-' + crypto.randomBytes(4).toString('hex').toUpperCase();
    }

    const model = this.repo.create({ ...rest, unique_id, ...(manufacturer && { manufacturer }), ...(category && { category }) });
    return this.repo.save(model);
  }

  async findAll(query: PaginationDto): Promise<PaginatedResult<any>> {
    const { page, limit } = query;
    const [data, total] = await this.repo.createQueryBuilder('model')
      .leftJoinAndSelect('model.manufacturer', 'manufacturer')
      .leftJoinAndSelect('model.category', 'category')
      .loadRelationCountAndMap('model.referenceCount', 'model.assets')
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
    const model = await this.repo.findOne({ where: { id }, relations: ['manufacturer', 'category'] });
    if (!model) throw new NotFoundException(`Model ${id} not found`);
    return model;
  }

  async update(id: number, dto: UpdateModelDto) {
    const { manufacturer_id, category_id, ...rest } = dto;
    const model = await this.findOne(id);
    Object.assign(model, rest);

    if (manufacturer_id !== undefined) {
      const mfg = await this.mfgRepo.findOne({ where: { id: manufacturer_id } });
      if (!mfg) throw new BadRequestException(`Manufacturer ${manufacturer_id} not found`);
      model.manufacturer = mfg;
    }

    if (category_id !== undefined) {
      const cat = await this.categoryRepo.findOne({ where: { id: category_id } });
      if (!cat) throw new BadRequestException(`Category ${category_id} not found`);
      model.category = cat;
    }

    return this.repo.save(model);
  }

  async remove(id: number) {
    await this.repo.remove(await this.findOne(id));
  }
}
