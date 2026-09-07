import { IsString, IsNotEmpty } from 'class-validator';

export class CreateItemTypeDto {
  @IsString() @IsNotEmpty()
  name!: string;
}
