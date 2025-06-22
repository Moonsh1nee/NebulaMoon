import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Field } from './field.schema';
import { Model } from 'mongoose';

@Injectable()
export class FieldsService {
  constructor(@InjectModel(Field.name) private fieldModel: Model<Field>) {}

  async create(
    name: string,
    type: string,
    options: string[] = [],
  ): Promise<Field> {
    if (['select', 'multi-select'].includes(type) && !options.length) {
      throw new BadRequestException(`Options are required for type ${type}`);
    }

    const field = new this.fieldModel({ name, type, options });
    return field.save();
  }

  async findAll(): Promise<Field[]> {
    return this.fieldModel.find().exec();
  }
}
