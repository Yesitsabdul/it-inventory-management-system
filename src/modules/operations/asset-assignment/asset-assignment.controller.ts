import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, HttpCode } from '@nestjs/common';
import { AssetAssignmentService } from './asset-assignment.service';
import { CreateAssetAssignmentDto } from './create-asset-assignment.dto';
import { UpdateAssetAssignmentDto } from './update-asset-assignment.dto';
import { CheckoutDto } from './checkout.dto';
import { CheckinDto } from './checkin.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
@Controller('asset-assignments')
export class AssetAssignmentController {
  constructor(private service: AssetAssignmentService) {}
  @Post() create(@Body() dto: CreateAssetAssignmentDto) { return this.service.create(dto); }
  @Get() findAll(@Query() query: PaginationDto) { return this.service.findAll(query); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAssetAssignmentDto) { return this.service.update(id, dto); }
  @Delete(':id') @HttpCode(204) remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }

  @Post('checkout') checkout(@Body() dto: CheckoutDto) { return this.service.checkout(dto); }
  @Post('checkin') checkin(@Body() dto: CheckinDto) { return this.service.checkin(dto); }
}
