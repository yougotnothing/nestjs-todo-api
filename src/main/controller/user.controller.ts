import { Body, Controller, Get, Header, Patch, Post, Query, Headers, HttpException, HttpStatus, Req, ExecutionContext, NestInterceptor, CallHandler, UseInterceptors } from "@nestjs/common";
import { UserService } from "../service/user.service";
import { ApiHeader } from "@nestjs/swagger";
import { TodoEntity } from "../entity/todo.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entity/user.entity";
import { Repository } from "typeorm";

@Controller('user')
export class UserController {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userService: UserService
  ) {}

  @Patch('/change-avatar')
  @ApiHeader({ name: 'Authorization', description: 'Authorization header', required: true })
  async changeAvatar(@Body() body: { id: number, avatar: string }) {
    return await this.userService.changeAvatar(body.id, body.avatar);
  }

  @Patch('/change-name')
  @ApiHeader({ name: 'Authorization', description: 'Authorization header', required: true })
  async changeName(@Body() body: { id: number, name: string }) {
    return await this.userService.changeName(body.id, body.name);
  }

  @Post('/add-task')
  @ApiHeader({ name: 'Authorization', description: 'Authorization header', required: true })
  async addTask(@Body() body: { task: TodoEntity }) {
    return await this.userService.addTask(body.task);
  }

  @Patch('/delete-task')
  @ApiHeader({ name: 'Authorization', description: 'Authorization header', required: true })
  async deleteTask(@Req() req: Request, @Body() task_id: number) {
    const token = req.headers['authorization'].split(' ')[1];
    const encryptedToken = Buffer.from(token, 'base64').toString('utf-8').split(':');
    const user = await this.userRepository.findOneBy({ name: encryptedToken[0] });
    const isTokenValid = await user.comparePassword(encryptedToken[1]);

    if(!isTokenValid) {
      throw new HttpException("token is invalid.", HttpStatus.UNAUTHORIZED);
    }

    return await this.userService.deleteTask(user.id, task_id);
  }

  @Get('/get-tasks')
  async getTasks(@Req() req: Request) {
    const token = req.headers['authorization'].split(' ')[1];
    const encryptedToken = Buffer.from(token, 'base64').toString('utf-8').split(':');
    const user = await this.userRepository.findOneBy({ name: encryptedToken[0] });
    const isTokenValid = await user.comparePassword(encryptedToken[1]);

    if(!isTokenValid) {
      throw new HttpException("token is invalid.", HttpStatus.UNAUTHORIZED);
    }

    return await this.userService.getTasks(user.id);
  }
}