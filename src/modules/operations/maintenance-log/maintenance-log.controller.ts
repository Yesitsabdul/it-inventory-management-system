import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, HttpCode } from '@nestjs/common';
import { MaintenanceLogService } from './maintenance-log.service';
import { CreateMaintenanceLogDto } from './create-maintenance-log.dto';
import { UpdateMaintenanceLogDto } from './update-maintenance-log.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
@Controller('maintenance-logs')
export class MaintenanceLogController {
  constructor(private service: MaintenanceLogService) {}
  @Post() create(@Body() dto: CreateMaintenanceLogDto) { return this.service.create(dto); }
  @Get() findAll(@Query() query: PaginationDto) { return this.service.findAll(query); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMaintenanceLogDto) { return this.service.update(id, dto); }
  @Delete(':id') @HttpCode(204) remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
