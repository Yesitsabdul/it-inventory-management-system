import { IsInt, IsOptional, IsString } from 'class-validator';

export class CheckinDto {
  @IsInt()
  asset_id!: number;

  @IsString() @IsOptional()
  notes?: string;

}