import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FieldsService } from './fields.service';
import { Field } from './field.schema';

@Controller('fields')
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(
    @Body() body: { name: string; type: string; options?: string[] },
  ): Promise<Field> {
    return this.fieldsService.create(body.name, body.type, body.options);
  }

  @Get()
  async findAll(): Promise<Field[]> {
    return this.fieldsService.findAll();
  }
}
