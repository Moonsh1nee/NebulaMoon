import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class TaskFieldDto {
  @IsString()
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
  fields?: TaskFieldDto[];
}
