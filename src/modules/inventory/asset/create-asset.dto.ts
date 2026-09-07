import { IsString, IsNotEmpty, IsOptional, IsInt, IsNumber, IsDateString, Min } from 'class-validator';

export class CreateAssetDto {
  @IsString() @IsNotEmpty()
  asset_tag!: string;

  @IsString() @IsOptional()
  name?: string;

  @IsString() @IsOptional()
  serial_number?: string;

  @IsNumber() @Min(0) @IsOptional()
  purchase_cost?: number;

  @IsDateString() @IsOptional()
  purchase_date?: string;

  @IsDateString() @IsOptional()
  warranty_expiry?: string;

  @IsString() @IsOptional()
  notes?: string;

  @IsInt() @Min(1) @IsOptional()
  quantity?: number;

  @IsInt()
  model_id!: number;


  @IsInt() @IsOptional()
  location_id?: number;

  @IsInt() @IsOptional()
  vendor_id?: number;
}