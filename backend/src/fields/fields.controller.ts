import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FieldsService } from './fields.service';
import { Field } from './field.schema';

export class CreateFieldDto {
  name: string;
  type: string;
  options?: string[];
}

@Controller('fields')
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createFieldDto: CreateFieldDto): Promise<Field> {
    return this.fieldsService.create(
      createFieldDto.name,
      createFieldDto.type,
      createFieldDto.options,
    );
  }

  @Get()
  async findAll(): Promise<Field[]> {
    return this.fieldsService.findAll();
  }
}
