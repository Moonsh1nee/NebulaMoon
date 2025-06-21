import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './task.schema';
import { Field } from '../fields/field.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(Field.name) private fieldModel: Model<Field>,
  ) {}

  async findAll(filters: Record<string, any> = {}): Promise<Task[]> {
    try {
      const query: any = {};
      if (Object.keys(filters).length > 0) {
        const fieldNames = Object.keys(filters);
        const fieldDefs = await this.fieldModel
          .find({ name: { $in: fieldNames } })
          .exec();
        if (fieldDefs.length === 0) {
          throw new BadRequestException('No matching fields found');
        }

        const fieldMap = fieldDefs.reduce((map, field) => {
          map[field.name] = field._id;
          return map;
        }, {});

        query['fields'] = {
          $elemMatch: {
            fieldId: { $in: Object.values(fieldMap) },
            value: { $in: Object.values(filters) },
          },
        };
      }
      return await this.taskModel.find(query).populate('fields.fieldId').exec();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to filter tasks: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel
      .findById(id)
      .populate('fields.fieldId')
      .exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, fields } = createTaskDto;
    try {
      if (fields) {
        for (const field of fields) {
          if (!field.fieldId || field.value === undefined) {
            throw new BadRequestException('Field ID and value are required');
          }
          const fieldDef = await this.fieldModel.findById(field.fieldId).exec();
          if (!fieldDef) {
            throw new NotFoundException(
              `Field with ID ${field.fieldId} not found`,
            );
          }
          switch (fieldDef.type) {
            case 'date':
              if (!this.isValidDate(field.value)) {
                throw new BadRequestException(
                  `Invalid date for field ${fieldDef.name}`,
                );
              }
              break;
            case 'select':
              if (!this.isValidOption(field.value, fieldDef.options)) {
                throw new BadRequestException(
                  `Invalid value for field ${fieldDef.name}`,
                );
              }
              break;
            case 'multi-select':
              if (
                !Array.isArray(field.value) ||
                !this.isValidOption(field.value, fieldDef.options)
              ) {
                throw new BadRequestException(
                  `Invalid value for field ${fieldDef.name}`,
                );
              }
              break;
            case 'checkbox':
              if (typeof field.value !== 'boolean') {
                throw new BadRequestException(
                  `Invalid boolean for field ${fieldDef.name}`,
                );
              }
              break;
            case 'text':
              if (typeof field.value !== 'string') {
                throw new BadRequestException(
                  `Invalid string for field ${fieldDef.name}`,
                );
              }
              break;
            default:
              throw new BadRequestException(
                `Unsupported field type ${fieldDef.type}`,
              );
          }
        }
      }
      const task = new this.taskModel({ title, fields });
      return await task.save();
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(`Failed to create task: ${error.message}`);
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    try {
      if (updateTaskDto.fields) {
        for (const field of updateTaskDto.fields) {
          if (!field.fieldId || field.value === undefined) {
            throw new BadRequestException('Field ID and value are required');
          }
          const fieldDef = await this.fieldModel.findById(field.fieldId).exec();
          if (!fieldDef) {
            throw new NotFoundException(
              `Field with ID ${field.fieldId} not found`,
            );
          }
          switch (fieldDef.type) {
            case 'date':
              if (!this.isValidDate(field.value)) {
                throw new BadRequestException(
                  `Invalid date for field ${fieldDef.name}`,
                );
              }
              break;
            case 'select':
              if (!this.isValidOption(field.value, fieldDef.options)) {
                throw new BadRequestException(
                  `Invalid value for field ${fieldDef.name}`,
                );
              }
              break;
            case 'multi-select':
              if (
                !Array.isArray(field.value) ||
                !this.isValidOption(field.value, fieldDef.options)
              ) {
                throw new BadRequestException(
                  `Invalid value for field ${fieldDef.name}`,
                );
              }
              break;
            case 'checkbox':
              if (typeof field.value !== 'boolean') {
                throw new BadRequestException(
                  `Invalid boolean for field ${fieldDef.name}`,
                );
              }
              break;
            case 'text':
              if (typeof field.value !== 'string') {
                throw new BadRequestException(
                  `Invalid string for field ${fieldDef.name}`,
                );
              }
              break;
            default:
              throw new BadRequestException(
                `Unsupported field type ${fieldDef.type}`,
              );
          }
        }
      }
      const task = await this.taskModel
        .findByIdAndUpdate(id, updateTaskDto, { new: true })
        .populate('fields.fieldId')
        .exec();
      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      return task;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(`Failed to update task: ${error.message}`);
    }
  }

  async delete(id: string): Promise<void> {
    const result = await this.taskModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  private isValidDate(value: any): boolean {
    if (typeof value !== 'string' && typeof value !== 'number') {
      return false;
    }
    const date = new Date(value);
    return !isNaN(date.getTime()) && date.toISOString() !== 'Invalid Date';
  }

  private isValidOption(value: any, options: string[]): boolean {
    if (Array.isArray(value)) {
      return value.every((v) => typeof v === 'string' && options.includes(v));
    }
    return typeof value === 'string' && options.includes(value);
  }
}
