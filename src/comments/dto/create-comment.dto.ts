import { IsString, IsInt, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCommentDto {
  @IsInt()
  user_id: number; 
  @IsInt()
  task_id: number;

  @IsString()
  comment: string;

  @IsDate()
  @Type(() => Date) 
  date: Date; 

  @IsOptional() 
  @IsString()
  additionalInfo?: string; 
}
