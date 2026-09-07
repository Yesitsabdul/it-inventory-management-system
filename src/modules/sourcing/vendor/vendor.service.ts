import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from '../../../database/entities/vendor.entity';
import { CreateVendorDto } from './create-vendor.dto';
import { UpdateVendorDto } from './update-vendor.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

import { instanceToPlain } from 'class-transformer';

@Injectable()
export class VendorService {
  constructor(@InjectRepository(Vendor) private repo: Repository<Vendor>) {}

  create(dto: CreateVendorDto) {
    return this.repo.save(this.repo.create(dto));
  }
  async findAll(query: PaginationDto): Promise<PaginatedResult<any>> {
    const { page, limit } = query;
    const [data, total] = await this.repo.createQueryBuilder('vendor')
      .loadRelationCountAndMap('vendor.referenceCount', 'vendor.assets')
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
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new NotFoundException(`Vendor ${id} not found`);
    return record;
  }
  async update(id: number, dto: UpdateVendorDto) {
    const record = await this.findOne(id);
    Object.assign(record, dto);
    return this.repo.save(record);
  }
  async remove(id: number) {
    await this.repo.remove(await this.findOne(id));
  }
}
