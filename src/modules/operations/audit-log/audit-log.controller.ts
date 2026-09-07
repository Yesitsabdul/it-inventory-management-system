import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, HttpCode } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { CreateAuditLogDto } from './create-audit-log.dto';
import { UpdateAuditLogDto } from './update-audit-log.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
@Controller('audit-logs')
export class AuditLogController {
  constructor(private service: AuditLogService) {}
  @Post() create(@Body() dto: CreateAuditLogDto) { return this.service.create(dto); }
  @Get() findAll(@Query() query: PaginationDto) { return this.service.findAll(query); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAuditLogDto) { return this.service.update(id, dto); }
  @Delete(':id') @HttpCode(204) remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
