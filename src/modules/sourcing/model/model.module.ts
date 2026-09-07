import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Model } from '../../../database/entities/model.entity';
import { Manufacturer } from '../../../database/entities/manufacturer.entity';
import { Category } from '../../../database/entities/category.entity';
import { ModelService } from './model.service';
import { ModelController } from './model.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Model, Manufacturer, Category])],
  controllers: [ModelController],
  providers: [ModelService],
})
export class ModelModule {}
