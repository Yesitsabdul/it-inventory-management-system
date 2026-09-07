import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateVendorDto {
  @IsString() @IsNotEmpty()
  name!: string;

  @IsString() @IsOptional()
  contact_name?: string;

  @IsEmail() @IsOptional()
  email?: string;

  @IsString() @IsOptional()
  phone?: string;
}