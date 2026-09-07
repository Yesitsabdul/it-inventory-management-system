import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceLog } from '../../../database/entities/maintenance-log.entity';
import { Asset } from '../../../database/entities/asset.entity';
import { User } from '../../../database/entities/user.entity';
import { Vendor } from '../../../database/entities/vendor.entity';
import { CreateMaintenanceLogDto } from './create-maintenance-log.dto';
import { UpdateMaintenanceLogDto } from './update-maintenance-log.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

@Injectable()
export class MaintenanceLogService {
  constructor(
    @InjectRepository(MaintenanceLog) private repo: Repository<MaintenanceLog>,
    @InjectRepository(Asset) private assetRepo: Repository<Asset>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Vendor) private vendorRepo: Repository<Vendor>,
  ) {}

  async create(dto: CreateMaintenanceLogDto) {
    const { asset_id, performed_by_id, vendor_id, ...rest } = dto;

    const asset = await this.assetRepo.findOne({ where: { id: asset_id } });
    if (!asset) throw new BadRequestException(`Asset ${asset_id} not found`);

    let performed_by: User | undefined;
    if (performed_by_id) {
      const found = await this.userRepo.findOne({ where: { id: performed_by_id } });
      if (!found) throw new BadRequestException(`User ${performed_by_id} not found`);
      performed_by = found;
    }
    let vendor: Vendor | undefined;
    if (vendor_id) {
      const found = await this.vendorRepo.findOne({ where: { id: vendor_id } });
      if (!found) throw new BadRequestException(`Vendor ${vendor_id} not found`);
      vendor = found;
    }

    const record = this.repo.create({
      ...rest,
      asset,
      ...(performed_by && { performed_by }),
      ...(vendor && { vendor }),
    });
    return this.repo.save(record);
  }

  async findAll(query: PaginationDto): Promise<PaginatedResult<MaintenanceLog>> {
    const { page, limit } = query;
    const [data, total] = await this.repo.findAndCount({
      relations: ['asset', 'performed_by', 'vendor'],
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, meta: { page, limit, total, lastPage: Math.ceil(total / limit) } };
  }

  async findOne(id: number) {
    const record = await this.repo.findOne({ where: { id }, relations: ['asset', 'performed_by', 'vendor'] });
    if (!record) throw new NotFoundException(`MaintenanceLog ${id} not found`);
    return record;
  }

  async update(id: number, dto: UpdateMaintenanceLogDto) {
    const { asset_id, performed_by_id, vendor_id, ...rest } = dto;
    const record = await this.findOne(id);
    Object.assign(record, rest);

    if (asset_id !== undefined) {
      const a = await this.assetRepo.findOne({ where: { id: asset_id } });
      if (!a) throw new BadRequestException(`Asset ${asset_id} not found`);
      record.asset = a;
    }
    if (performed_by_id !== undefined) {
      const u = await this.userRepo.findOne({ where: { id: performed_by_id } });
      if (!u) throw new BadRequestException(`User ${performed_by_id} not found`);
      record.performed_by = u;
    }
    if (vendor_id !== undefined) {
      const v = await this.vendorRepo.findOne({ where: { id: vendor_id } });
      if (!v) throw new BadRequestException(`Vendor ${vendor_id} not found`);
      record.vendor = v;
    }

    return this.repo.save(record);
  }

  async remove(id: number) {
    await this.repo.remove(await this.findOne(id));
  }
}
