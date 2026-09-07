import { Injectable, NotFoundException, BadRequestException, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as fs from 'fs';
import { User } from '../../../database/entities/user.entity';
import { Role } from '../../../database/entities/role.entity';
import { Department } from '../../../database/entities/department.entity';
import { AssetAssignment } from '../../../database/entities/asset-assignment.entity';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Department) private deptRepo: Repository<Department>,
  ) {}

  async onModuleInit() {
    const rolesCount = await this.roleRepo.count();
    if (rolesCount === 0) {
      console.log('Seeding default roles...');
      await this.roleRepo.save([
        { name: 'Admin', description: 'Administrator with full access' },
        { name: 'Employee', description: 'Standard employee role' },
      ]);
    }

    const usersCount = await this.repo.count();
    if (usersCount === 0) {
      console.log('Seeding default admin user...');
      const adminRole = await this.roleRepo.findOne({ where: { name: 'Admin' } });
      const passwordHash = await bcrypt.hash('admin123', 10);
      
      const adminUser = this.repo.create({
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@example.com',
        employee_number: 'ADM001',
        is_active: true,
        password: passwordHash,
        role: adminRole,
      });
      await this.repo.save(adminUser);
      console.log('Admin user seeded successfully with password: admin123');
    }
  }

  async getPrefixes(): Promise<string[]> {
    const users = await this.repo.find({ select: ['employee_number'] });
    const prefixes = new Set<string>();
    prefixes.add('HB');
    for (const u of users) {
      if (!u.employee_number) continue;
      const match = u.employee_number.match(/^([a-zA-Z]+)-?/);
      if (match) {
        prefixes.add(match[1].toUpperCase());
      }
    }
    return Array.from(prefixes);
  }

  async create(dto: CreateUserDto) {
    const { role_id, department_id, password, ...rest } = dto;
    let finalPassword = password || 'defaultpassword123';

    const role = await this.roleRepo.findOne({ where: { id: role_id } });
    if (!role) throw new BadRequestException(`Role ${role_id} does not exist`);

    if (role.name === 'Employee') {
      finalPassword = 'NO_LOGIN';
    }

    let department: Department | undefined;
    if (department_id) {
      const found = await this.deptRepo.findOne({ where: { id: department_id } });
      if (!found) throw new BadRequestException(`Department ${department_id} does not exist`);
      department = found;
    }

    try {
      const user = this.repo.create({ ...rest, password: finalPassword, role, ...(department && { department }) });
      return await this.repo.save(user);
    } catch (err: any) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('A record with this email or employee number already exists.');
      }
      throw err;
    }
  }

  async findAll(query: PaginationDto): Promise<PaginatedResult<any>> {
    const { page, limit } = query;
    const [data, total] = await this.repo.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.department', 'department')
      .loadRelationCountAndMap('user.referenceCount', 'user.assignments')
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
    const user = await this.repo.findOne({ where: { id }, relations: ['role', 'department'] });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email }, relations: ['role', 'department'] });
  }

  async update(id: number, dto: UpdateUserDto) {
    const { role_id, department_id, password, ...rest } = dto;
    const user = await this.findOne(id);
    Object.assign(user, rest);

    if (password) {
      user.password = password;
    }

    if (role_id !== undefined) {
      const role = await this.roleRepo.findOne({ where: { id: role_id } });
      if (!role) throw new BadRequestException(`Role ${role_id} not found`);
      user.role = role;
    }
    if (department_id !== undefined) {
      const dept = await this.deptRepo.findOne({ where: { id: department_id } });
      if (!dept) throw new BadRequestException(`Department ${department_id} not found`);
      user.department = dept;
    }

    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    
    // Prevent deletion of the sole admin
    if (user.role && user.role.name === 'Admin') {
      const adminCount = await this.repo.count({ where: { role: { name: 'Admin' } } });
      if (adminCount <= 1) {
        throw new ConflictException('Cannot delete the only admin in the system.');
      }
    }
    
    await this.repo.remove(user);
  }

  async bulkImport(data: any[]): Promise<{ success: number; failed: number; errors: { row: number; data: any; error: string }[] }> {
    const role = await this.roleRepo.findOne({ where: { name: 'Employee' } });
    if (!role) {
      throw new BadRequestException('The "Employee" role does not exist in the system.');
    }

    const errors: { row: number; data: any; error: string }[] = [];
    const depts = await this.deptRepo.find();
    const deptMap = new Map(depts.map(d => [d.name.toLowerCase(), d]));

    // ── PASS 1: Validate every row, collect ALL errors, save nothing ──
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 1;

      // Individual field checks — give specific message per missing field
      if (!row.first_name?.trim()) {
        errors.push({ row: rowNum, data: row, error: 'First Name is required but was empty' });
        continue;
      }
      if (!row.last_name?.trim()) {
        errors.push({ row: rowNum, data: row, error: 'Last Name is required but was empty' });
        continue;
      }
      if (!row.email?.trim()) {
        errors.push({ row: rowNum, data: row, error: 'Email is required but was empty' });
        continue;
      }
      if (!row.department_name?.trim()) {
        errors.push({ row: rowNum, data: row, error: 'Department is required but was empty' });
        continue;
      }

      const dept = deptMap.get(row.department_name.toLowerCase().trim());
      if (!dept) {
        errors.push({ row: rowNum, data: row, error: `Department "${row.department_name}" not found in the system` });
        continue;
      }

      const existingUser = await this.repo.findOne({
        where: [
          { email: row.email },
          ...(row.employee_number ? [{ employee_number: row.employee_number }] : [])
        ]
      });

      if (existingUser) {
        errors.push({ row: rowNum, data: row, error: `User with email "${row.email}"${row.employee_number ? ` or employee number "${row.employee_number}"` : ''} already exists` });
      }
    }

    // If ANY row has an error, return immediately without saving anything
    if (errors.length > 0) {
      return { success: 0, failed: errors.length, errors };
    }

    // ── PASS 2: All rows valid — now save everything ──
    let success = 0;
    const saveErrors: { row: number; data: any; error: string }[] = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const dept = deptMap.get(row.department_name.toLowerCase().trim());
      try {
        const user = this.repo.create({
          first_name: row.first_name,
          last_name: row.last_name,
          email: row.email,
          employee_number: row.employee_number || null,
          password: 'NO_LOGIN',
          role: role,
          department: dept,
        });
        await this.repo.save(user);
        success++;
      } catch (err: any) {
        saveErrors.push({ row: i + 1, data: row, error: `Database error: ${err.message}` });
      }
    }

    return { success, failed: saveErrors.length, errors: saveErrors };
  }
}