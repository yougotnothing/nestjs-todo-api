import { Body, Controller, Delete, HttpCode, HttpException, HttpStatus, Inject, Patch, Req } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TodoEntity } from "../entity/todo.entity";
import { Repository } from "typeorm";
import { Auth } from "../guard/auth.guard";

@Controller('tasks')
export class TasksController {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
    private readonly auth: Auth
  ) {}

  @Patch('/change-header')
  @HttpCode(200)
  async changeHeader(@Body() body: { id: number, header: string }, @Req() req: Request) {
    const isTokenValid = await this.auth.validate(req.headers['authorization'].split(' ')[1]);
    const todo = await this.todoRepository.findOneBy({ id: body.id });

    if(!isTokenValid) throw new HttpException("token is invalid.", HttpStatus.UNAUTHORIZED);
    if(!todo) throw new HttpException("task not found.", HttpStatus.NOT_FOUND);
    
    return await this.todoRepository.update(todo.id, { header: body.header });
  }

  @Delete('/delete-task')
  @HttpCode(200)
  async deleteTask(@Body() body: { id: number }, @Req() req: Request) {
    const isTokenValid = await this.auth.validate(req.headers['authorization'].split(' ')[1]);
    const todo = await this.todoRepository.findOneBy({ id: body.id });

    if(!isTokenValid) throw new HttpException("token is invalid.", HttpStatus.UNAUTHORIZED);
    if(!todo) throw new HttpException("task not found.", HttpStatus.NOT_FOUND);

    return await this.todoRepository.delete(todo.id);
  }

  @Patch('/change-content')
  @HttpCode(200)
  async changeContent(@Body() body: { id: number, content: string }, @Req() req: Request) {
    const isTokenValid = await this.auth.validate(req.headers['authorization'].split(' ')[1]);
    const todo = await this.todoRepository.findOneBy({ id: body.id });

    if(!isTokenValid) throw new HttpException("token is invalid.", HttpStatus.UNAUTHORIZED);
    if(!todo) throw new HttpException("task not found.", HttpStatus.NOT_FOUND);

    return await this.todoRepository.update(todo.id, { content: body.content });
  }
}