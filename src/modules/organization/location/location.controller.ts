import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, HttpCode } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './create-location.dto';
import { UpdateLocationDto } from './update-location.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';

@Controller('locations')
export class LocationController {
  constructor(private service: LocationService) {}

  @Post() create(@Body() dto: CreateLocationDto) { return this.service.create(dto); }
  @Get() findAll(@Query() query: PaginationDto) { return this.service.findAll(query); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLocationDto) { return this.service.update(id, dto); }
  @Delete(':id') @HttpCode(204) remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}