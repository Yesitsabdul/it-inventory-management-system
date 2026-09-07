import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from '../../../database/entities/department.entity';
import { Location } from '../../../database/entities/location.entity';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Department, Location])],
  controllers: [DepartmentController],
  providers: [DepartmentService],
})
export class DepartmentModule {}