import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TaskFieldDto {
  @IsString()
  @IsNotEmpty()
  fieldId: string;

  @IsNotEmpty()
  value: any;
}

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TaskFieldDto)
  fields: TaskFieldDto[];
}
