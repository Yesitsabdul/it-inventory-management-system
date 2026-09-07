import { IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class CreateAssetAssignmentDto {
  @IsString()
  @IsOptional()
  action_type?: string;

  @IsDateString()
  @IsOptional()
  checkout_at?: string;

  @IsDateString()
  @IsOptional()
  checkin_at?: string;

  @IsDateString()
  @IsOptional()
  expected_checkin?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber()
  asset_id!: number;

  @IsNumber()
  assigned_to_id!: number;

  @IsNumber()
  @IsOptional()
  assigned_by_id?: number;
}
