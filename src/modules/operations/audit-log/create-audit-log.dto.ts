import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateAuditLogDto {
  @IsString()
  action!: string;

  @IsString()
  @IsOptional()
  entity_type?: string;

  @IsNumber()
  @IsOptional()
  entity_id?: number;

  @IsString()
  @IsOptional()
  details?: string;

  @IsDateString()
  @IsOptional()
  created_at?: string;

  @IsNumber()
  @IsOptional()
  user_id?: number;
}
