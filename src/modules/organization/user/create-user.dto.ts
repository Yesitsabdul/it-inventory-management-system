import { IsString, IsNotEmpty, IsEmail, IsOptional, IsInt, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString() @IsNotEmpty()
  first_name!: string;

  @IsString() @IsNotEmpty()
  last_name!: string;

  @IsEmail()
  email!: string;

  @IsString() @MinLength(6) @IsOptional()
  password?: string;

  @IsString() @IsOptional()
  employee_number?: string;

  @IsInt()
  role_id!: number;

  @IsInt() @IsNotEmpty()
  department_id!: number;
}