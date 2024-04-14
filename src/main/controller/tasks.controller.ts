import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Patch, Req } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TodoEntity } from "../entity/todo.entity";
import { Repository } from "typeorm";
import { Auth } from "../guard/auth.guard";
import { UserEntity } from "../entity/user.entity";
import { TasksService } from "../service/tasks.service";
import { TodoType } from "../types/todo.type";

@Controller('tasks')
export class TasksController {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
    @InjectRepository(UserEntity)
    private readonly tasksService: TasksService,
    private readonly auth: Auth
  ) {}

  @Patch('/change-header')
  @HttpCode(200)
  async changeHeader(@Body() body: { id: number, header: string }, @Req() req: Request) {
    const isTokenValid = await this.auth.validate(req.headers['authorization'].split(' ')[1]);
    const todo = await this.todoRepository.findOneBy({ id: body.id });

    if(!isTokenValid) throw new HttpException("token is invalid.", HttpStatus.UNAUTHORIZED);
    if(!todo) throw new HttpException("task not found.", HttpStatus.NOT_FOUND);
    
    return await this.tasksService.changeHeader({ ...body });
  }

  @Delete('/delete-task')
  @HttpCode(200)
  async deleteTask(@Body() body: { id: number }, @Req() req: Request) {
    const isTokenValid = await this.auth.validate(req.headers['authorization'].split(' ')[1]);
    const todo = await this.todoRepository.findOneBy({ id: body.id });

    if(!isTokenValid) throw new HttpException("token is invalid.", HttpStatus.UNAUTHORIZED);
    if(!todo) throw new HttpException("task not found.", HttpStatus.NOT_FOUND);

    return await this.tasksService.deleteTask(body.id);
  }

  @Patch('/change-content')
  @HttpCode(200)
  async changeContent(@Body() body: { id: number, content: string }, @Req() req: Request) {
    const isTokenValid = await this.auth.validate(req.headers['authorization'].split(' ')[1]);
    const todo = await this.todoRepository.findOneBy({ id: body.id });

    if(!isTokenValid) throw new HttpException("token is invalid.", HttpStatus.UNAUTHORIZED);
    if(!todo) throw new HttpException("task not found.", HttpStatus.NOT_FOUND);

    return await this.tasksService.changeContent({ ...body });
  }

  @Get('/get-tasks')
  @HttpCode(200)
  async getTasks(@Body() body: { id: number, substring: string }, @Req() req: Request) {
    const isTokenValid = await this.auth.validate(req.headers['authorization'].split(' ')[1]);
    const todo = await this.todoRepository.findOneBy({ id: body.id });

    if(!isTokenValid) throw new HttpException("token invalid.", HttpStatus.UNAUTHORIZED);
    if(!todo) throw new HttpException("tasks not found.", HttpStatus.NOT_FOUND);

    return await this.tasksService.searchTasks(body.substring);
  }

  @Get('/get-tasks-by-type')
  @HttpCode(200)
  async getTasksByType(@Body() body: { type: TodoType }, @Req() req: Request) {
    const isTokenValid = await this.auth.validate(req.headers['authorization'].split(' ')[1]);
    const todo = await this.todoRepository.findBy({ type: body.type }); 

    if(!isTokenValid) throw new HttpException("token invalid.", HttpStatus.UNAUTHORIZED);
    if(!todo) throw new HttpException("tasks not found.", HttpStatus.NOT_FOUND);

    return await this.tasksService.getTasksByType(body.type);
  }
}