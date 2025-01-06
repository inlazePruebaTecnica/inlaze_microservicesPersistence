import { IsString, IsOptional, IsDate } from 'class-validator';

export class CreateProyectDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsDate()
  creationDate?: Date;
}
