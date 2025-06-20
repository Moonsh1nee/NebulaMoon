import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class TaskFieldDto {
  @IsString()
  fieldId: string;

  @IsNotEmpty()
  value: any;
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsArray()
  @IsOptional()
  fields?: TaskFieldDto[];
}
