import { Body, Controller, Get, Patch, Post, HttpException, HttpStatus, Req, Delete, HttpCode } from "@nestjs/common";
import { UserService } from "../service/user.service";
import { TodoEntity } from "../entity/todo.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entity/user.entity";
import { Repository } from "typeorm";

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
  async addTask(@Body() body: { task: TodoEntity }, @Req() req: Request) {
    const token = req.headers['authorization'].split(' ')[1];
    const encryptedToken = Buffer.from(token, 'base64').toString('utf-8').split(':');
    const user = await this.userRepository.findOneBy({ name: encryptedToken[0] });
    const isTokenValid = await user.comparePassword(encryptedToken[1]);

    if(!isTokenValid) {
      throw new HttpException("token is invalid.", HttpStatus.UNAUTHORIZED);
    }

    return await this.userService.addTask(body.task, encryptedToken[0]);
  }

  @Delete('/delete-task')
  @HttpCode(200)
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
  @HttpCode(200)
  async getTasks(@Req() req: Request) {
    const token = req.headers['authorization'].split(' ')[1];
    const encryptedToken = Buffer.from(token, 'base64').toString('utf-8').split(':');
    const user = await this.userRepository.findOneBy({ name: encryptedToken[0] });
    const isTokenValid = await user.comparePassword(encryptedToken[1]);

    if(!isTokenValid) throw new HttpException("token is invalid.", HttpStatus.UNAUTHORIZED);

    return await this.userService.getTasks(encryptedToken[0]);
  }
}