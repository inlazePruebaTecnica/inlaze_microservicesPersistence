import {
  IsString,
  IsOptional,
  IsPositive,
  IsBoolean,
} from 'class-validator';

export class UpdateTaskAssignamentDto {
  @IsOptional()
  @IsPositive()
  id: number;
  @IsOptional()
  @IsPositive()
  user_id: number;
  @IsOptional()
  @IsPositive()
  task_id: number;
  @IsOptional()
  @IsBoolean()
  isRemove?: boolean;
}
