import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
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

  async findAll(userId: string): Promise<Task[]> {
    return this.taskModel.find({ userId }).populate('fields.fieldId').exec();
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.taskModel
      .findById(id)
      .populate('fields.fieldId')
      .exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    if (task.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const { title, fields } = createTaskDto;
    if (fields) {
      for (const field of fields) {
        const fieldDef = await this.fieldModel.findById(field.fieldId).exec();
        if (!fieldDef) {
          throw new NotFoundException(
            `Field with ID ${field.fieldId} not found`,
          );
        }
        switch (fieldDef.type) {
          case 'text':
            if (typeof field.value !== 'string') {
              throw new BadRequestException(
                `Value for ${fieldDef.name} must be a string`,
              );
            }
            break;
          case 'date':
            if (!this.isValidDate(field.value)) {
              throw new BadRequestException(
                `Invalid date for ${fieldDef.name}`,
              );
            }
            break;
          case 'double-date':
            if (!this.isValidDoubleDate(field.value)) {
              throw new BadRequestException(
                `Invalid double-date for ${fieldDef.name}`,
              );
            }
            break;
          case 'select':
            if (!this.isValidOption(field.value, fieldDef.options)) {
              throw new BadRequestException(
                `Invalid option for ${fieldDef.name}`,
              );
            }
            break;
          case 'checkbox':
            if (typeof field.value !== 'boolean') {
              throw new BadRequestException(
                `Value for ${fieldDef.name} must be a boolean`,
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
    const task = new this.taskModel({ title, fields, userId });
    return task.save();
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    if (updateTaskDto.fields) {
      for (const field of updateTaskDto.fields) {
        const fieldDef = await this.fieldModel.findById(field.fieldId).exec();
        if (!fieldDef) {
          throw new NotFoundException(
            `Field with ID ${field.fieldId} not found`,
          );
        }
        switch (fieldDef.type) {
          case 'text':
            if (typeof field.value !== 'string') {
              throw new BadRequestException(
                `Value for ${fieldDef.name} must be a string`,
              );
            }
            break;
          case 'date':
            if (!this.isValidDate(field.value)) {
              throw new BadRequestException(
                `Invalid date for ${fieldDef.name}`,
              );
            }
            break;
          case 'double-date':
            if (!this.isValidDoubleDate(field.value)) {
              throw new BadRequestException(
                `Invalid double-date for ${fieldDef.name}`,
              );
            }
            break;
          case 'select':
            if (!this.isValidOption(field.value, fieldDef.options)) {
              throw new BadRequestException(
                `Invalid option for ${fieldDef.name}`,
              );
            }
            break;
          case 'checkbox':
            if (typeof field.value !== 'boolean') {
              throw new BadRequestException(
                `Value for ${fieldDef.name} must be a boolean`,
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
      .findOneAndUpdate({ _id: id, userId }, updateTaskDto, { new: true })
      .populate('fields.fieldId')
      .exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async delete(id: string, userId: string): Promise<void> {
    const task = await this.taskModel
      .findOneAndDelete({ _id: id, userId })
      .exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  private isValidDate(value: any): boolean {
    if (typeof value !== 'string') return false;
    const date = new Date(value);
    return !isNaN(date.getTime());
  }

  private isValidDoubleDate(value: any): boolean {
    if (!Array.isArray(value) || value.length !== 2) return false;
    return value.every(
      (date) => typeof date === 'string' && !isNaN(new Date(date).getTime()),
    );
  }

  private isValidOption(value: any, options: string[]): boolean {
    return typeof value === 'string' && options.includes(value);
  }
}
