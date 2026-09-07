import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ItemTypeService } from './item-type.service';
import { CreateItemTypeDto } from './create-item-type.dto';
import { UpdateItemTypeDto } from './update-item-type.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Controller('item-types')
@UseGuards(JwtAuthGuard)
export class ItemTypeController {
  constructor(private readonly service: ItemTypeService) {}

  @Post()
  create(@Body() dto: CreateItemTypeDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateItemTypeDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
