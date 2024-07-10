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
  Header
} from "@nestjs/common";
import { UserService } from "service/user";
import { AuthGuard } from "guard/auth";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import * as multer from "multer";
import { MulterFile } from "types/multer-file";
import { UUID } from "crypto";
import { ChangePasswordDto } from "types/change-password";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/change-avatar')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('avatar', { storage: multer.memoryStorage() }))
  async changeAvatar(@UploadedFile() avatar: MulterFile, @Req() req: Request) {
    if(!avatar) throw new HttpException("file is empty.", HttpStatus.BAD_REQUEST);

    return await this.userService.changeAvatar(avatar.buffer, req['user'].name);
  }

  @Patch('/change-name')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async changeName(
    @Body() body: { newName: string },
    @Req() req: Request
  ) {
    return await this.userService.changeName(body.newName, req['user'].id);
  }

  @Get('/get-tasks')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async getTasks(@Req() req: Request) {
    return await this.userService.getTasks(req['user'].id);
  }

  @Get('/get-user')
  @HttpCode(200)
  async getUser(@Query('id') id: UUID) {
    return await this.userService.getUser(id);
  }

  @Patch('/change-password')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async changePassword(@Req() req: Request, @Body() body: ChangePasswordDto) {
    const { password, confirmPassword } = body;

    if(password !== confirmPassword) throw new HttpException("passwords don't match.", 443);

    return await this.userService.changePassword(password, req['user'].id);
  }

  @Get('/get-avatar')
  @HttpCode(200)
  @Header('Content-Type', 'image/jpeg')
  async getAvatar(
    @Query('id') id: UUID,
    @Query('time') time: Date,
    @Res() res: Response
  ) {
    res.send(await this.userService.getAvatar(id, time));
  }
}