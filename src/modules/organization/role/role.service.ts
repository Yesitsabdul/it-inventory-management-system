import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../../database/entities/role.entity';
import { User } from '../../../database/entities/user.entity';
import { CreateRoleDto } from './create-role.dto';
import { UpdateRoleDto } from './update-role.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private repo: Repository<Role>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(dto: CreateRoleDto) {
    try {
      return await this.repo.save(this.repo.create(dto));
    } catch (err: any) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('A role with this name already exists.');
      }
      throw err;
    }
  }

  async findAll(query: PaginationDto): Promise<PaginatedResult<any>> {
    const { page, limit } = query;
    const [roles, total] = await this.repo.findAndCount({ skip: (page - 1) * limit, take: limit });

    // Attach user count so frontend can disable delete button
    const data = await Promise.all(
      roles.map(async (role) => ({
        ...role,
        userCount: await this.userRepo.count({ where: { role: { id: role.id } } }),
      })),
    );

    return { data, meta: { page, limit, total, lastPage: Math.ceil(total / limit) } };
  }

  async findOne(id: number) {
    const role = await this.repo.findOne({ where: { id } });
    if (!role) throw new NotFoundException(`Role ${id} not found`);
    return role;
  }

  async update(id: number, dto: UpdateRoleDto) {
    const role = await this.findOne(id);
    Object.assign(role, dto);
    return this.repo.save(role);
  }

  async remove(id: number) {
    const role = await this.findOne(id);
    const userCount = await this.userRepo.count({ where: { role: { id } } });
    if (userCount > 0) {
      throw new ConflictException(
        `Cannot delete role "${role.name}" — it is currently assigned to ${userCount} user(s). Reassign those users first.`,
      );
    }
    await this.repo.remove(role);
  }
}