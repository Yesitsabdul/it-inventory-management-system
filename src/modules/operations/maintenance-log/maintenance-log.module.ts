import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceLog } from '../../../database/entities/maintenance-log.entity';
import { Asset } from '../../../database/entities/asset.entity';
import { User } from '../../../database/entities/user.entity';
import { Vendor } from '../../../database/entities/vendor.entity';
import { MaintenanceLogService } from './maintenance-log.service';
import { MaintenanceLogController } from './maintenance-log.controller';
@Module({
  imports: [TypeOrmModule.forFeature([MaintenanceLog, Asset, User, Vendor])],
  controllers: [MaintenanceLogController],
  providers: [MaintenanceLogService],
})
export class MaintenanceLogModule {}
