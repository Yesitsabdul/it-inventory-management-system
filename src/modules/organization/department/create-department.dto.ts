import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateDepartmentDto {
  @IsString() @IsNotEmpty()
  name!: string;

  @IsInt() @IsOptional()
  location_id?: number;
}