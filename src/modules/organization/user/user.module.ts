import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../database/entities/user.entity';
import { Role } from '../../../database/entities/role.entity';
import { Department } from '../../../database/entities/department.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Department])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}