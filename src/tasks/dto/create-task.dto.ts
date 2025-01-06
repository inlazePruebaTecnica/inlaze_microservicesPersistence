import { Type } from 'class-transformer';
import { IsString, IsOptional, IsInt, IsDate } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDate()
  @Type(() => Date)
  dateLimit: Date;

  @IsOptional()
  @IsString()
  state?: string = 'TODO'; 

  @IsOptional()
  @IsInt()
  user_id?: number;

  @IsInt()
  proyectId: number; 
}
