import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemType } from '../../../database/entities/item-type.entity';
import { ItemTypeController } from './item-type.controller';
import { ItemTypeService } from './item-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([ItemType])],
  controllers: [ItemTypeController],
  providers: [ItemTypeService],
  exports: [ItemTypeService]
})
export class ItemTypeModule {}
