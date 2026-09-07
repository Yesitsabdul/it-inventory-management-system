import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateModelDto {
  @IsString() @IsNotEmpty()
  name!: string;

  @IsString() @IsOptional()
  model_number?: string;

  @IsString() @IsOptional()
  unique_id?: string;

  @IsInt() @IsNotEmpty()
  manufacturer_id!: number;

  @IsInt()
  category_id!: number;
}