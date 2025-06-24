import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

interface AuthRequest extends Request {
  user: { id: string; email: string };
}

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(@Req() req: AuthRequest): Promise<Task[]> {
    return this.tasksService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ): Promise<Task> {
    return this.tasksService.findOne(id, req.user.id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: AuthRequest,
  ): Promise<Task> {
    return this.tasksService.create(createTaskDto, req.user.id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: AuthRequest,
  ): Promise<Task> {
    return this.tasksService.update(id, updateTaskDto, req.user.id);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ): Promise<void> {
    return this.tasksService.delete(id, req.user.id);
  }
}
