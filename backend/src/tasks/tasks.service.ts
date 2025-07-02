import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<TaskDocument> {
    const task = await this.taskModel.create({
      ...createTaskDto,
      userId,
    });
    return task.populate('categoryId');
  }

  async findAll(userId: string, categoryId?: string): Promise<TaskDocument[]> {
    const query: { userId: string; categoryId?: string } = { userId };
    if (categoryId) {
      query['categoryId'] = categoryId;
    }
    return this.taskModel.find(query).populate('categoryId').exec();
  }

  async findOne(id: string): Promise<TaskDocument> {
    const task = await this.taskModel
      .findById(id)
      .populate('categoryId')
      .exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskDocument> {
    const task = await this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .populate('categoryId')
      .exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async remove(id: string): Promise<void> {
    const result = await this.taskModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Task not found');
    }
  }
}
