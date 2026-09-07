import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Asset } from '../../../database/entities/asset.entity';
import { Model } from '../../../database/entities/model.entity';
import { Location } from '../../../database/entities/location.entity';
import { Vendor } from '../../../database/entities/vendor.entity';
import { AssetAssignment } from '../../../database/entities/asset-assignment.entity';
import { CreateAssetDto } from './create-asset.dto';
import { UpdateAssetDto } from './update-asset.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(Asset) private repo: Repository<Asset>,
    @InjectRepository(Model) private modelRepo: Repository<Model>,
    @InjectRepository(Location) private locationRepo: Repository<Location>,
    @InjectRepository(Vendor) private vendorRepo: Repository<Vendor>,
  ) {}
  async create(dto: CreateAssetDto) {
    const { model_id, location_id, vendor_id, ...rest } = dto;
    const model = await this.modelRepo.findOne({ where: { id: model_id } });
    if (!model) throw new BadRequestException(`Model ${model_id} does not exist`);
    let location: Location | undefined;
    if (location_id) {
      const found = await this.locationRepo.findOne({ where: { id: location_id } });
      if (!found) throw new BadRequestException(`Location ${location_id} does not exist`);
      location = found;
    }
    let vendor: Vendor | undefined;
    if (vendor_id) {
      const found = await this.vendorRepo.findOne({ where: { id: vendor_id } });
      if (!found) throw new BadRequestException(`Vendor ${vendor_id} does not exist`);
      vendor = found;
    }
    try {
      const asset = this.repo.create({
        ...rest,
        model,
        ...(location && { location }),
        ...(vendor && { vendor }),
      });
      return await this.repo.save(asset);
    } catch (err: any) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('An asset with this asset tag or serial number already exists.');
      }
      throw err;
    }
  }
  async findAll(query: PaginationDto): Promise<PaginatedResult<Asset>> {
    const { page, limit } = query;
    const [data, total] = await this.repo.findAndCount({
      relations: ['model', 'location', 'vendor'],
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, meta: { page, limit, total, lastPage: Math.ceil(total / limit) } };
  }
  async findOne(id: number) {
    const a = await this.repo.findOne({
      where: { id },
      relations: ['model', 'model.category', 'location', 'vendor'],
    });
    if (!a) throw new NotFoundException(`Asset ${id} not found`);
    return a;
  }
  async update(id: number, dto: UpdateAssetDto) {
    const { model_id, location_id, vendor_id, ...rest } = dto;
    const a = await this.findOne(id);
    Object.assign(a, rest);

    if (model_id !== undefined) {
      const model = await this.modelRepo.findOne({ where: { id: model_id } });
      if (!model) throw new BadRequestException(`Model ${model_id} does not exist`);
      a.model = model;
    }
    if (location_id !== undefined) {
      const loc = await this.locationRepo.findOne({ where: { id: location_id } });
      if (!loc) throw new BadRequestException(`Location ${location_id} does not exist`);
      a.location = loc;
    }
    if (vendor_id !== undefined) {
      const v = await this.vendorRepo.findOne({ where: { id: vendor_id } });
      if (!v) throw new BadRequestException(`Vendor ${vendor_id} does not exist`);
      a.vendor = v;
    }
    return this.repo.save(a);
  }
  async remove(id: number) {
    const a = await this.findOne(id);

    // Check if the asset is currently checked out (has an assignment with no checkin_at)
    const activeAssignment = await this.repo.manager.findOne(AssetAssignment, {
      where: { asset: { id }, checkin_at: IsNull() },
    });

    if (activeAssignment) {
      throw new BadRequestException('Cannot delete an asset that is currently checked out. Please check it in first.');
    }

    await this.repo.remove(a);
  }
}