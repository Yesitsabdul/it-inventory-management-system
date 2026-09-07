import { IsString, IsNotEmpty, IsOptional, IsIn, IsInt} from 'class-validator';

export class CreateCategoryDto {
  @IsString() @IsNotEmpty()
  name!: string;

  @IsInt() @IsNotEmpty()
  type_id!: number;
}