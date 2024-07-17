import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Query,
  Req,
  UseGuards
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TodoEntity } from "entity/todo";
import { TasksService } from "service/tasks";
import { TodoType } from "types/todo";
import { AuthGuard } from "guard/auth";
import { CreateTodoDto } from "types/create-todo";
import { Request } from "express";

@Controller('tasks')
export class TasksController {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
    private readonly tasksService: TasksService,
  ) {}

  @Post('/create-task')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async createTask(@Body() body: { task: CreateTodoDto }, @Req() req: Request) {
    return await this.tasksService.createTask(body.task, req.session['user_id']);
  }

  @Patch('/change-header')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async changeHeader(@Body() body: { id: number, header: string }) {
    return await this.tasksService.changeHeader({ ...body });
  }

  @Delete('/delete-task')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async deleteTask(@Query('id') id: number) {
    const todo = await this.todoRepository.findOneBy({ id });

    if(!todo) throw new HttpException("task not found.", HttpStatus.NOT_FOUND);

    return await this.tasksService.deleteTask(id);
  }

  @Get('/tasks-by-substring')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async getTasks(@Query() query: { substring: string }) {

    if(!query.substring.trim().length) throw new HttpException("substring cannot be empty.", 441);

    return await this.tasksService.getTasksBySubstring(query.substring);
  }

  @Get('/tasks-by-type')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async getTasksByType(@Query('type') type: TodoType) {
    return await this.tasksService.getTasksByType(decodeURIComponent(type) as TodoType);
  }

  @Get('/today-tasks')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async getTodayTasks(@Query() query: { createdAt: string }) {
    const todo = await this.todoRepository.findBy({ createdAt: query.createdAt }); 

    if(!todo) throw new HttpException("tasks not found.", HttpStatus.NOT_FOUND);

    return await this.tasksService.getTodayTasks(query.createdAt);
  }

  @Get('/tasks-by-header')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async getTasksByHeader(@Query('header') header: string) {
    const todo = await this.todoRepository.findBy({ header });

    if(!todo) throw new HttpException("tasks not found.", HttpStatus.NOT_FOUND);
    if(!header.length) throw new HttpException("header cannot be empty.", HttpStatus.BAD_REQUEST);

    return await this.tasksService.getTasksByHeader(header);
  }

  @Get('/month-tasks')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async getMonthTasks(@Query('month') month: string) {
    return await this.tasksService.getTasksByMonth(month);
  }

  @Get('/week-tasks')
  @HttpCode(200)
  async getWeekTasks(@Query('week') week: string) {
    return await this.tasksService.getTasksByWeek(week);
  }

  @Get('/tasks-length')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async getTasksLength(@Req() req: Request) {
    return await this.tasksService.getTasksLength(req.session['user_id']);
  }

  @Get('/important-tasks')
  @HttpCode(200)
  async getImportantTasks(@Req() req: Request) {
    return await this.tasksService.getImportantTasks(req.session['user_id']);
  }
}