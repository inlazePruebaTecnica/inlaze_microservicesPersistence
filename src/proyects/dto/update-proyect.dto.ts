import { IsString, IsOptional, IsDate, IsPositive } from 'class-validator';

export class UpdateProyectDto {
  @IsPositive()
  id: number;
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  creationDate?: Date;
}
