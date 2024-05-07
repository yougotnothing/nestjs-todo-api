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
  HttpCode
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "entity/user.entity";
import { UserService } from "service/user.service";
import { CreateTodoDto } from "types/create.todo.dto";

@Controller('user')
export class UserController {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userService: UserService,
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
    const token = req.headers['authorization'].split(' ')[1];
    const encryptedToken = Buffer.from(token, 'base64').toString('utf-8').split(':');
    const user = await this.userRepository.findOneBy({ name: encryptedToken[0] });
    const isTokenValid = await user.comparePassword(encryptedToken[1]);

    if(!isTokenValid) {
      throw new HttpException("token is invalid.", HttpStatus.UNAUTHORIZED);
    }

    return await this.userService.addTask(task, encryptedToken[0]);
  }

  @Delete('/delete-task')
  @HttpCode(200)
  async deleteTask(@Req() req: Request, @Body() task_id: number) {
    const token = req.headers['authorization'].split(' ')[1];
    const encryptedToken = Buffer.from(token, 'base64').toString('utf-8').split(':');
    const user = await this.userRepository.findOneBy({ name: encryptedToken[0] });
    const isTokenValid = await user.comparePassword(encryptedToken[1]);

    if(!isTokenValid) throw new HttpException("token is invalid.", HttpStatus.UNAUTHORIZED);

    return await this.userService.deleteTask(user.id, task_id);
  }

  @Get('/get-tasks')
  @HttpCode(200)
  async getTasks(@Req() req: Request) {
    const token = req.headers['authorization'].split(' ')[1];
    const encryptedToken = Buffer.from(token, 'base64').toString('utf-8').split(':');
    const user = await this.userRepository.findOneBy({ name: encryptedToken[0] });
    const token_ = encryptedToken[1];
    const isTokenValid = await user.comparePassword(token_);

    if(!user) throw new HttpException("user not found.", HttpStatus.NOT_FOUND);
    if(!isTokenValid) throw new HttpException("token is invalid.", HttpStatus.UNAUTHORIZED);

    return await this.userService.getTasks(encryptedToken[0]);
  }

  @Get('/get-user')
  @HttpCode(200)
  async getUser(@Req() req: Request) {
    return await this.userService.getUser(req.headers['authorization'].split(' ')[1]);
  }
}