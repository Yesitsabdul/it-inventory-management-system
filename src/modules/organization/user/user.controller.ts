import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';

@Controller('users')
export class UserController {
  constructor(private service: UserService) {}
  
  @Post() create(@Body() dto: CreateUserDto) { return this.service.create(dto); }
  
  @Post('bulk-import')
  bulkImport(@Body() data: any[]) {
    return this.service.bulkImport(data);
  }

  @Get('prefixes') getPrefixes() { return this.service.getPrefixes(); }
  @Get() findAll(@Query() query: PaginationDto) { return this.service.findAll(query); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) { return this.service.update(id, dto); }
  @Delete(':id') @HttpCode(204) remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}