import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsInt,
  IsDate,
  IsPositive,
} from 'class-validator';

export class UpdateTaskDto {
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
  @Type(() => Date)
  dateLimit?: Date;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsInt()
  user_id?: number;
}
