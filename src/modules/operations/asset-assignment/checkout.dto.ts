import { IsInt, IsOptional, IsString, IsDateString } from 'class-validator';

export class CheckoutDto {
  @IsInt()
  asset_id!: number;

  @IsInt()
  assigned_to_id!: number;

  @IsInt() @IsOptional()
  assigned_by_id?: number;

  @IsDateString() @IsOptional()
  expected_checkin?: string;

  @IsString() @IsOptional()
  notes?: string;
}