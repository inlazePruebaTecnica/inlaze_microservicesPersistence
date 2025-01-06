import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsDate,
  IsPositive,
} from 'class-validator';

export class TaskFiltersDto {
  @IsString()
  task_id: string;
  @IsOptional()
  state?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateLimit?: string;

  @IsOptional()
  @IsPositive()
  assignedTo: number;
}
