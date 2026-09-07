import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateMaintenanceLogDto {
  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsDateString()
  @IsOptional()
  start_date?: string;

  @IsDateString()
  @IsOptional()
  completion_date?: string;

  @IsNumber()
  @IsOptional()
  cost?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber()
  asset_id!: number;

  @IsNumber()
  @IsOptional()
  performed_by_id?: number;

  @IsNumber()
  @IsOptional()
  vendor_id?: number;
}
