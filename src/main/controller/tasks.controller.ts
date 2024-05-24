import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Patch,
  Query,
  Req
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TodoEntity } from "entity/todo.entity";
import { TasksService } from "service/tasks.service";
import { TodoType } from "types/todo.type";
import { Auth } from "guard/auth.guard";

@Controller('tasks')
export class TasksController {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
    private readonly tasksService: TasksService,
    private readonly auth: Auth
  ) {}

  @Patch('/change-header')
  @HttpCode(200)
  async changeHeader(@Body() body: { id: number, header: string }, @Req() req: Request) {
    const validation = await this.auth.validate(req.headers['authorization'].split(' ')[1]);
    const todo = await this.todoRepository.findOneBy({ id: body.id });

    if(!validation.isValid) throw new HttpException("token is invalid.", HttpStatus.UNAUTHORIZED);
    if(!todo) throw new HttpException("task not found.", HttpStatus.NOT_FOUND);
    
    return await this.tasksService.changeHeader({ ...body });
  }

  @Delete('/delete-task')
  @HttpCode(200)
  async deleteTask(@Query('id') id: number, @Req() req: Request) {
    const validation = await this.auth.validate(req.headers['authorization'].split(' ')[1]);
    const todo = await this.todoRepository.findOneBy({ id });

    if(!validation.isValid) throw new HttpException("token is invalid.", HttpStatus.UNAUTHORIZED);
    if(!todo) throw new HttpException("task not found.", HttpStatus.NOT_FOUND);

    return await this.tasksService.deleteTask(id);
  }

  @Get('/get-tasks')
  @HttpCode(200)
  async getTasks(@Query() query: { id: number, substring: string }, @Req() req: Request) {
    const validation = await this.auth.validate(req.headers['authorization'].split(' ')[1]);
    const todo = await this.todoRepository.findOneBy({ id: query.id });

    if(!validation.isValid) throw new HttpException("token invalid.", HttpStatus.UNAUTHORIZED);
    if(!todo) throw new HttpException("tasks not found.", HttpStatus.NOT_FOUND);

    return await this.tasksService.searchTasks(query.substring);
  }

  @Get('/get-tasks-by-type')
  @HttpCode(200)
  async getTasksByType(@Query('type') type: TodoType, @Req() req: Request) {
    const validation = await this.auth.validate(req.headers['authorization'].split(' ')[1]);
    const todo = await this.todoRepository.findBy({ type });

    if(!validation.isValid) throw new HttpException("token invalid.", HttpStatus.UNAUTHORIZED);
    if(!todo) throw new HttpException("tasks not found.", HttpStatus.NOT_FOUND);

    return await this.tasksService.getTasksByType(type);
  }

  @Get('/today-tasks')
  @HttpCode(200)
  async getTodayTasks(@Query() query: { createdAt: string }, @Req() req: Request) {
    const validation = await this.auth.validate(req.headers['authorization'].split(' ')[1]);
    const todo = await this.todoRepository.findBy({ createdAt: query.createdAt }); 

    if(!validation.isValid) throw new HttpException("token invalid.", HttpStatus.UNAUTHORIZED);
    if(!todo) throw new HttpException("tasks not found.", HttpStatus.NOT_FOUND);

    return await this.tasksService.getTodayTasks(query.createdAt);
  }

  @Get('/tasks-by-header')
  @HttpCode(200)
  async getTasksByHeader(@Query('header') header: string, @Req() req: Request) {
    const validation = await this.auth.validate(req.headers['authorization'].split(' ')[1]);
    const todo = await this.todoRepository.findBy({ header });

    if(!validation.isValid) throw new HttpException("token invalid.", HttpStatus.UNAUTHORIZED);
    if(!todo) throw new HttpException("tasks not found.", HttpStatus.NOT_FOUND);
    if(!header.length) throw new HttpException("header cannot be empty.", HttpStatus.BAD_REQUEST);

    return await this.tasksService.getTasksByHeader(header);
  }

  @Get('/month-tasks')
  @HttpCode(200)
  async getMonthTasks(@Query('month') month: string, @Req() req: Request) {
    const validation = await this.auth.validate(req.headers['authorization'].split(' ')[1]);

    if(!validation.isValid) throw new HttpException("token invalid.", HttpStatus.UNAUTHORIZED);

    return await this.tasksService.getTasksByMonth(month);
  }

  @Get('/week-tasks')
  @HttpCode(200)
  async getWeekTasks(@Query('week') week: string, @Req() req: Request) {
    const validation = await this.auth.validate(req.headers['authorization'].split(' ')[1]);

    if(!validation.isValid) throw new HttpException("token invalid.", HttpStatus.UNAUTHORIZED);

    return await this.tasksService.getTasksByWeek(week);
  }

  @Get('/tasks-length')
  @HttpCode(200)
  async getTasksLength(@Req() req: Request) {
    const validation = await this.auth.validate(req.headers['authorization'].split(' ')[1]);

    if(!validation.isValid) throw new HttpException("token invalid.", HttpStatus.UNAUTHORIZED);

    return await this.tasksService.getTasksLength();
  }
}