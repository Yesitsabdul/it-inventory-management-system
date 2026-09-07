import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../../../database/entities/department.entity';
import { Location } from '../../../database/entities/location.entity';
import { CreateDepartmentDto } from './create-department.dto';
import { UpdateDepartmentDto } from './update-department.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

import { instanceToPlain } from 'class-transformer';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department) private repo: Repository<Department>,
    @InjectRepository(Location) private locationRepo: Repository<Location>,
  ) {}

  async create(dto: CreateDepartmentDto) {
    const { location_id, ...rest } = dto;

    let location: Location | undefined;
    if (location_id) {
      const found = await this.locationRepo.findOne({ where: { id: location_id } });
      if (!found) throw new BadRequestException(`Location ${location_id} not found`);
      location = found;
    }

    const department = this.repo.create({ ...rest, ...(location && { location }) });
    return this.repo.save(department);
  }

  async findAll(query: PaginationDto): Promise<PaginatedResult<any>> {
    const { page, limit } = query;
    const [data, total] = await this.repo.createQueryBuilder('department')
      .leftJoinAndSelect('department.location', 'location')
      .loadRelationCountAndMap('department.referenceCount', 'department.users')
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
    const department = await this.repo.findOne({ where: { id }, relations: ['location'] });
    if (!department) throw new NotFoundException(`Department ${id} not found`);
    return department;
  }

  async update(id: number, dto: UpdateDepartmentDto) {
    const { location_id, ...rest } = dto;
    const department = await this.findOne(id);
    Object.assign(department, rest);

    if (location_id !== undefined) {
      const loc = await this.locationRepo.findOne({ where: { id: location_id } });
      if (!loc) throw new BadRequestException(`Location ${location_id} not found`);
      department.location = loc;
    }

    return this.repo.save(department);
  }

  async remove(id: number) {
    await this.repo.remove(await this.findOne(id));
  }
}