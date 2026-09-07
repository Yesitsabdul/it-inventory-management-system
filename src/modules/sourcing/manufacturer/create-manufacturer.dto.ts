import { IsString, IsNotEmpty, IsOptional, IsUrl, IsEmail } from 'class-validator';
export class CreateManufacturerDto {
  @IsString() @IsNotEmpty()
  name!: string;
  @IsUrl() @IsOptional()
  support_url?: string;
  @IsEmail() @IsOptional()
  support_email?: string;
}
