import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, HttpCode } from '@nestjs/common';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './create-asset.dto';
import { UpdateAssetDto } from './update-asset.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
@Controller('assets')
export class AssetController {
  constructor(private service: AssetService) {}
  @Post() create(@Body() dto: CreateAssetDto) { return this.service.create(dto); }
  @Get() findAll(@Query() query: PaginationDto) { return this.service.findAll(query); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAssetDto) { return this.service.update(id, dto); }
  @Delete(':id') @HttpCode(204) remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
