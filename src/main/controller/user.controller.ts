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
  Query,
  UploadedFile,
  UseInterceptors,
  Header,
  Res
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "entity/user.entity";
import { UserService } from "service/user.service";
import { CreateTodoDto } from "types/create.todo.dto";
import { Auth } from "guard/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import * as multer from "multer";

@Controller('user')
export class UserController {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userService: UserService,
    private readonly auth: Auth
  ) {}

  @Post('/change-avatar')
  @UseInterceptors(FileInterceptor('avatar', {
    storage: multer.memoryStorage()
  }))
  @HttpCode(200)
  @Header('Content-Type', 'multipart/form-data')
  async changeAvatar(@UploadedFile() avatar: Express.Multer.File, @Req() req: Request) {
    console.log('file received: ', avatar);

    if(!avatar) throw new HttpException("file is empty.", HttpStatus.BAD_REQUEST);

    const validation = await this.auth.validate(req.headers['authorization'].split(' ')[1]);

    if(!validation.isValid) throw new HttpException("token is invalid.", HttpStatus.UNAUTHORIZED);

    return await this.userService.changeAvatar(avatar.buffer, validation.name);
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
  async getUser(@Query('id') id: number) {
    return await this.userService.getUser(id);
  }

  @Get('/get-avatar')
  @HttpCode(200)
  async getAvatar(@Query('id') id: number, @Res() res: Response) {
    const avatar = await this.userService.getAvatar(id);
    if(!avatar) throw new HttpException("user not found.", HttpStatus.NOT_FOUND);

    res.setHeader('Content-Type', 'image/jpeg');
    res.send(avatar);
  }
}