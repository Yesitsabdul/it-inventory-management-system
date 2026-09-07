import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { AssetAssignment } from '../../../database/entities/asset-assignment.entity';
import { Asset } from '../../../database/entities/asset.entity';
import { User } from '../../../database/entities/user.entity';
import { MaintenanceLog } from '../../../database/entities/maintenance-log.entity';
import { CreateAssetAssignmentDto } from './create-asset-assignment.dto';
import { UpdateAssetAssignmentDto } from './update-asset-assignment.dto';
import { CheckoutDto } from './checkout.dto';
import { CheckinDto } from './checkin.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

@Injectable()
export class AssetAssignmentService {
  constructor(
    @InjectRepository(AssetAssignment) private repo: Repository<AssetAssignment>,
    @InjectRepository(Asset) private assetRepo: Repository<Asset>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(MaintenanceLog) private maintenanceLogRepo: Repository<MaintenanceLog>,
  ) {}

  // --- generic CRUD ---
  async create(dto: CreateAssetAssignmentDto) {
    const { asset_id, assigned_to_id, assigned_by_id, ...rest } = dto;

    const asset = await this.assetRepo.findOne({ where: { id: asset_id } });
    if (!asset) throw new BadRequestException(`Asset ${asset_id} not found`);

    const assigned_to = await this.userRepo.findOne({ where: { id: assigned_to_id } });
    if (!assigned_to) throw new BadRequestException(`User ${assigned_to_id} not found`);

    let assigned_by: User | undefined;
    if (assigned_by_id) {
      const found = await this.userRepo.findOne({ where: { id: assigned_by_id } });
      if (!found) throw new BadRequestException(`User ${assigned_by_id} not found`);
      assigned_by = found;
    }

    const record = this.repo.create({
      ...rest,
      asset,
      assigned_to,
      ...(assigned_by && { assigned_by }),
    });
    return this.repo.save(record);
  }

  async findAll(query: PaginationDto): Promise<PaginatedResult<AssetAssignment>> {
    const { page, limit } = query;
    const [data, total] = await this.repo.findAndCount({
      relations: ['asset', 'assigned_to', 'assigned_by'],
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, meta: { page, limit, total, lastPage: Math.ceil(total / limit) } };
  }

  async findOne(id: number) {
    const r = await this.repo.findOne({ where: { id }, relations: ['asset', 'assigned_to', 'assigned_by'] });
    if (!r) throw new NotFoundException(`AssetAssignment ${id} not found`);
    return r;
  }

  async update(id: number, dto: UpdateAssetAssignmentDto) {
    const { asset_id, assigned_to_id, assigned_by_id, ...rest } = dto;
    const r = await this.findOne(id);
    Object.assign(r, rest);

    if (asset_id !== undefined) {
      const a = await this.assetRepo.findOne({ where: { id: asset_id } });
      if (!a) throw new BadRequestException(`Asset ${asset_id} not found`);
      r.asset = a;
    }
    if (assigned_to_id !== undefined) {
      const u = await this.userRepo.findOne({ where: { id: assigned_to_id } });
      if (!u) throw new BadRequestException(`User ${assigned_to_id} not found`);
      r.assigned_to = u;
    }
    if (assigned_by_id !== undefined) {
      const u = await this.userRepo.findOne({ where: { id: assigned_by_id } });
      if (!u) throw new BadRequestException(`User ${assigned_by_id} not found`);
      r.assigned_by = u;
    }

    return this.repo.save(r);
  }

  async remove(id: number) {
    await this.repo.remove(await this.findOne(id));
  }

  // --- checkout / checkin business logic ---

  async checkout(dto: CheckoutDto) {
    const asset = await this.assetRepo.findOne({ where: { id: dto.asset_id } });
    if (!asset) throw new NotFoundException(`Asset ${dto.asset_id} not found`);

    const assigned_to = await this.userRepo.findOne({ where: { id: dto.assigned_to_id } });
    if (!assigned_to) throw new BadRequestException(`User ${dto.assigned_to_id} not found`);

    // Count how many units are currently checked out (not yet checked in)
    const activeCheckoutCount = await this.repo.count({
      where: { asset: { id: dto.asset_id }, checkin_at: IsNull() },
    });
    if (activeCheckoutCount >= asset.quantity) {
      throw new ConflictException(
        `All ${asset.quantity} unit(s) of this asset are already checked out.`,
      );
    }

    const activeMaintenance = await this.maintenanceLogRepo.findOne({
      where: { asset: { id: dto.asset_id }, completion_date: IsNull() },
    });
    if (activeMaintenance) {
      throw new ConflictException(
        `Asset ${dto.asset_id} cannot be checked out because it is currently under maintenance.`,
      );
    }

    let assigned_by: User | undefined;
    if (dto.assigned_by_id) {
      const found = await this.userRepo.findOne({ where: { id: dto.assigned_by_id } });
      if (!found) throw new BadRequestException(`User ${dto.assigned_by_id} not found`);
      assigned_by = found;
    }

    const assignment = this.repo.create({
      action_type: 'checkout',
      checkout_at: new Date(),
      expected_checkin: dto.expected_checkin ? new Date(dto.expected_checkin) : undefined,
      notes: dto.notes,
      asset,
      assigned_to,
      ...(assigned_by && { assigned_by }),
    });
    await this.repo.save(assignment);


    return this.findOne(assignment.id);
  }

  async checkin(dto: CheckinDto) {
    const activeAssignment = await this.repo.findOne({
      where: { asset: { id: dto.asset_id }, checkin_at: IsNull() },
      relations: ['asset'],
    });
    if (!activeAssignment) {
      throw new BadRequestException(`No active checkout found for asset ${dto.asset_id}`);
    }

    activeAssignment.checkin_at = new Date();
    activeAssignment.action_type = 'checkin';
    if (dto.notes) activeAssignment.notes = dto.notes;
    await this.repo.save(activeAssignment);


    return this.findOne(activeAssignment.id);
  }
}