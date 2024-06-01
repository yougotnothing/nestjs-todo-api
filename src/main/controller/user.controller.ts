import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  HttpException,
  HttpStatus,
  Req,
  HttpCode,
  Query,
  UploadedFile,
  UseInterceptors,
  Header,
  Res
} from "@nestjs/common";
import { UserService } from "service/user.service";
import { Auth } from "guard/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import * as multer from "multer";

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly auth: Auth
  ) {}

  @Post('/change-avatar')
  @UseInterceptors(FileInterceptor('avatar', {
    storage: multer.memoryStorage()
  }))
  @HttpCode(200)
  async changeAvatar(@UploadedFile() avatar: Express.Multer.File, @Req() req: Request) {
    if(!avatar) throw new HttpException("file is empty.", HttpStatus.BAD_REQUEST);

    const validation = await this.auth.validate(req.headers['authorization'].split(' ')[1]);

    if(!validation.isValid) throw new HttpException("token is invalid.", HttpStatus.UNAUTHORIZED);

    return await this.userService.changeAvatar(avatar.buffer, validation.name);
  }

  @Patch('/change-name')
  @HttpCode(200)
  async changeName(@Body() name: string, @Query('id') id: number, @Req() req: Request) {
    const validation = await this.auth.validate(req.headers['authorization'].split(' ')[1]);

    if(!validation.isValid) throw new HttpException("token is invalid.", HttpStatus.UNAUTHORIZED);

    return await this.userService.changeName(id, name);
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

  @Patch('/change-password')
  @HttpCode(200)
  async changePassword(
    @Req() req: Request,
    @Query('id') id: number,
    @Body() body: { password: string, confirmPassword: string }
  ) {
    const { password, confirmPassword } = body;
    const validation = await this.auth.validate(req.headers['authorization'].split(' ')[1]);
    
    if(!validation.isValid) throw new HttpException("token is invalid.", HttpStatus.UNAUTHORIZED);
    if(password !== confirmPassword) throw new HttpException("passwords don't match.", 443);

    return await this.userService.changePassword(id, password);
  }

  @Get('/get-avatar')
  @HttpCode(200)
  async getAvatar(@Query('id') id: number, @Query('time') time: Date, @Res() res: Response) {
    const avatar = await this.userService.getAvatar(id, time);

    res.setHeader('Content-Type', 'image/jpeg');
    res.send(avatar);
  }
}