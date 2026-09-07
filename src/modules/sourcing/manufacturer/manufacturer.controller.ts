import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, HttpCode } from '@nestjs/common';
import { ManufacturerService } from './manufacturer.service';
import { CreateManufacturerDto } from './create-manufacturer.dto';
import { UpdateManufacturerDto } from './update-manufacturer.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';

@Controller('manufacturers')
export class ManufacturerController {
  constructor(private service: ManufacturerService) {}

  @Post() create(@Body() dto: CreateManufacturerDto) { return this.service.create(dto); }
  @Get() findAll(@Query() query: PaginationDto) { return this.service.findAll(query); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateManufacturerDto) { return this.service.update(id, dto); }
  @Delete(':id') @HttpCode(204) remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}