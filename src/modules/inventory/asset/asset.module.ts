import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from '../../../database/entities/asset.entity';
import { Model } from '../../../database/entities/model.entity';
import { Location } from '../../../database/entities/location.entity';
import { Vendor } from '../../../database/entities/vendor.entity';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Asset, Model, Location, Vendor])],
  controllers: [AssetController],
  providers: [AssetService],
})
export class AssetModule {}