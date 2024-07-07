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
  Res,
  UseGuards,
  Headers
} from "@nestjs/common";
import { UserService } from "service/user";
import { Auth } from "guard/auth";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import * as multer from "multer";
import { MulterFile } from "types/multer-file";
import { JwtService } from "@nestjs/jwt";

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  @Post('/change-avatar')
  @UseGuards(Auth)
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('avatar', { storage: multer.memoryStorage() }))
  async changeAvatar(@UploadedFile() avatar: MulterFile, @Req() req: Request) {
    if(!avatar) throw new HttpException("file is empty.", HttpStatus.BAD_REQUEST);

    return await this.userService.changeAvatar(avatar.buffer, req['user'].name);
  }

  @Patch('/change-name')
  @UseGuards(Auth)
  @HttpCode(200)
  async changeName(
    @Body() body: { newName: string },
    @Headers('X-User-Id') id: number,
    @Headers('X-User-Password') password: string
  ) {
    return await this.userService.changeName(body.newName, id, password);
  }

  @Get('/get-tasks')
  @UseGuards(Auth)
  @HttpCode(200)
  async getTasks(@Req() req: Request) {
    return await this.userService.getTasks(req['user'].name);
  }

  @Get('/get-user')
  @HttpCode(200)
  async getUser(@Query('id') id: number) {
    return await this.userService.getUser(id);
  }

  @Patch('/change-password')
  @UseGuards(Auth)
  @HttpCode(200)
  async changePassword(
    @Req() req: Request,
    @Body() body: { password: string, confirmPassword: string }
  ) {
    const { password, confirmPassword } = body;
    
    if(password !== confirmPassword) throw new HttpException("passwords don't match.", 443);

    return await this.userService.changePassword(password, req.headers['X-User-Id']);
  }

  @Get('/get-avatar')
  @HttpCode(200)
  async getAvatar(
    @Query('id') id: number,
    @Query('time') time: Date,
    @Res() res: Response
  ) {
    const avatar = await this.userService.getAvatar(id, time);

    res.setHeader('Content-Type', 'image/jpeg');
    res.send(avatar);
  }

  @Post('/verify-email')
  @HttpCode(200)
  async verifyEmail(@Query('token') token: string) {
    
  }
}
