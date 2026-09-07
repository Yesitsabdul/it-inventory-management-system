import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manufacturer } from '../../../database/entities/manufacturer.entity';
import { CreateManufacturerDto } from './create-manufacturer.dto';
import { UpdateManufacturerDto } from './update-manufacturer.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

import { instanceToPlain } from 'class-transformer';

@Injectable()
export class ManufacturerService {
  constructor(@InjectRepository(Manufacturer) private repo: Repository<Manufacturer>) {}

  create(dto: CreateManufacturerDto) {
    return this.repo.save(this.repo.create(dto));
  }
  async findAll(query: PaginationDto): Promise<PaginatedResult<any>> {
    const { page, limit } = query;
    const [data, total] = await this.repo.createQueryBuilder('manufacturer')
      .loadRelationCountAndMap('manufacturer.referenceCount', 'manufacturer.models')
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
    const m = await this.repo.findOne({ where: { id } });
    if (!m) throw new NotFoundException(`Manufacturer ${id} not found`);
    return m;
  }
  async update(id: number, dto: UpdateManufacturerDto) {
    const m = await this.findOne(id);
    Object.assign(m, dto);
    return this.repo.save(m);
  }
  async remove(id: number) {
    await this.repo.remove(await this.findOne(id));
  }
}