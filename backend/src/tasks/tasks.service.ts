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

  async findAll(): Promise<Task[]> {
    return this.taskModel.find().populate('fields.fieldId').exec();
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
    for (const field of fields || []) {
      const fieldDef = await this.fieldModel.findById(field.fieldId).exec();
      if (!fieldDef) {
        throw new NotFoundException(`Field with ID ${field.fieldId} not found`);
      }
      // Валидация значения по типу поля
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
    const task = new this.taskModel({ title, fields });
    return task.save();
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    // Валидация для обновления
    if (updateTaskDto.fields) {
      for (const field of updateTaskDto.fields) {
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
  }

  async delete(id: string): Promise<void> {
    const result = await this.taskModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  private isValidDate(value: any): boolean {
    return !isNaN(new Date(value).getTime());
  }

  private isValidOption(value: any, options: string[]): boolean {
    if (Array.isArray(value)) {
      return value.every((v) => options.includes(v));
    }
    return options.includes(value);
  }
}
