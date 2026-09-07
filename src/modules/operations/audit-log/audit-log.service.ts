import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../../../database/entities/audit-log.entity';
import { User } from '../../../database/entities/user.entity';
import { CreateAuditLogDto } from './create-audit-log.dto';
import { UpdateAuditLogDto } from './update-audit-log.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog) private repo: Repository<AuditLog>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(dto: CreateAuditLogDto) {
    const { user_id, ...rest } = dto;

    let user: User | undefined;
    if (user_id) {
      const found = await this.userRepo.findOne({ where: { id: user_id } });
      if (!found) throw new BadRequestException(`User ${user_id} not found`);
      user = found;
    }

    const record = this.repo.create({ ...rest, ...(user && { user }) });
    return this.repo.save(record);
  }

  async findAll(pagination?: PaginationDto) {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 20;
    const [data, total] = await this.repo.findAndCount({
      relations: ['user'],
      select: {
        user: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, meta: { page, limit, total, lastPage: Math.ceil(total / limit) } };
  }

  async findOne(id: number) {
    const l = await this.repo.findOne({
      where: { id },
      relations: ['user'],
      select: {
        user: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
        },
      },
    });
    if (!l) throw new NotFoundException(`AuditLog ${id} not found`);
    return l;
  }

  async update(id: number, dto: UpdateAuditLogDto) {
    const { user_id, ...rest } = dto;
    const l = await this.findOne(id);
    Object.assign(l, rest);
    if (user_id !== undefined) {
      const user = await this.userRepo.findOne({ where: { id: user_id } });
      if (!user) throw new BadRequestException(`User ${user_id} not found`);
      l.user = user;
    }
    return this.repo.save(l);
  }

  async remove(id: number) {
    await this.repo.remove(await this.findOne(id));
  }
}
