import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetAssignment } from '../../../database/entities/asset-assignment.entity';
import { Asset } from '../../../database/entities/asset.entity';
import { User } from '../../../database/entities/user.entity';
import { MaintenanceLog } from '../../../database/entities/maintenance-log.entity';
import { AssetAssignmentService } from './asset-assignment.service';
import { AssetAssignmentController } from './asset-assignment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AssetAssignment, Asset, User, MaintenanceLog])],
  controllers: [AssetAssignmentController],
  providers: [AssetAssignmentService],
})
export class AssetAssignmentModule {}