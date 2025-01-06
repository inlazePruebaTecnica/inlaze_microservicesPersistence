import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
} from 'class-validator';

export class TaskKeywordsDto {
  @IsString()
  project_id: string;
  @IsOptional()
  keywords?: string[];
}
