import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, HttpCode } from '@nestjs/common';
import { ModelService } from './model.service';
import { CreateModelDto } from './create-model.dto';
import { UpdateModelDto } from './update-model.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';

@Controller('models')
export class ModelController {
  constructor(private service: ModelService) {}

  @Post() create(@Body() dto: CreateModelDto) { return this.service.create(dto); }
  @Get() findAll(@Query() query: PaginationDto) { return this.service.findAll(query); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateModelDto) { return this.service.update(id, dto); }
  @Delete(':id') @HttpCode(204) remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
