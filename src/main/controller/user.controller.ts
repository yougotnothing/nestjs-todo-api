import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  HttpException,
  HttpStatus,
  Req,
  Delete,
  HttpCode,
  Query
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "entity/user.entity";
import { UserService } from "service/user.service";
import { CreateTodoDto } from "types/create.todo.dto";
import { Auth } from "guard/auth.guard";

@Controller('user')
export class UserController {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userService: UserService,
    private readonly auth: Auth
  ) {}

  @Patch('/change-avatar')
  @HttpCode(200)
  async changeAvatar(@Body() body: { id: number, avatar: string }) {
    return await this.userService.changeAvatar(body.id, body.avatar);
  }

  @Patch('/change-name')
  @HttpCode(200)
  async changeName(@Body() body: { id: number, name: string }) {
    return await this.userService.changeName(body.id, body.name);
  }

  @Post('/add-task')
  @HttpCode(200)
  async addTask(@Body() task: CreateTodoDto, @Req() req: Request) {
    const validation = await this.auth.validate(req.headers['authorization'].split(' ')[1]);

    if(!validation.isValid) throw new HttpException("token is invalid.", HttpStatus.UNAUTHORIZED);

    return await this.userService.addTask(task, validation.name);
  }

  @Delete('/delete-task')
  @HttpCode(200)
  async deleteTask(@Req() req: Request, @Body() task_id: number) {
    const validation = await this.auth.validate(req.headers['authorization'].split(' ')[1]);
    const user = await this.userRepository.findOneBy({ name: validation.name });

    if(!validation.isValid) throw new HttpException("token is invalid.", HttpStatus.UNAUTHORIZED);

    return await this.userService.deleteTask(user.id, task_id);
  }

  @Get('/get-tasks')
  @HttpCode(200)
  async getTasks(@Req() req: Request) {
    const validation = await this.auth.validate(req.headers['authorization'].split(' ')[1]);

    if(!validation.isValid) throw new HttpException("token is invalid.", HttpStatus.UNAUTHORIZED);

    return await this.userService.getTasks(validation.name);
  }

  @Get('/get-user')
  @HttpCode(200)
  async getUser(@Req() req: Request) {
    return await this.userService.getUser(req.headers['authorization'].split(' ')[1]);
  }

  @Get('/get-avatar')
  @HttpCode(200)
  async getAvatar(@Query('id') id: number,@Req() req: Request) {
    return await this.userService.getAvatar(req.headers['authorization'].split(' ')[1], id);
  }
}