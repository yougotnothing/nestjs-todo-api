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
  Header,
  Session
} from "@nestjs/common";
import { UserService } from "service/user";
import { AuthGuard } from "guard/auth";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import * as multer from "multer";
import { MulterFile } from "types/multer-file";
import { UUID } from "crypto";
import { ChangePasswordDto } from "types/change-password";
import { Request } from "express";
import { SessionID } from "decorator/sessionid";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/change-avatar')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('avatar', { storage: multer.memoryStorage() }))
  async changeAvatar(@UploadedFile() avatar: MulterFile, @Req() req: Request) {
    if(!avatar) throw new HttpException("file is empty.", HttpStatus.BAD_REQUEST);

    return await this.userService.changeAvatar(avatar.buffer, req.session['user_id']);
  }

  @Patch('/change-name')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async changeName(
    @Body("newName") newName: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return await this.userService.changeName(newName, res.req.session['user_id']);
  }

  @Get('/get-tasks')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async getTasks(@SessionID() id: UUID) {
    return await this.userService.getTasks(id);
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

    return await this.userService.changePassword(password, req.session['user_id']);
  }

  @Get('/get-avatar')
  @HttpCode(200)
  @Header('Content-Type', 'image/jpeg')
  async getAvatar(
    @Query('id') id: UUID,
    @Query('time') time: Date,
    @Res({ passthrough: true }) res: Response
  ) {
    res.send(await this.userService.getAvatar(id, time));
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async logout(@Req() req: Request) {
    return await this.userService.logout(req);
  }

  @Post('/change-email')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async changeEmail(@Body("newEmail") newEmail: string, @SessionID() id: UUID) {
    return await this.userService.changeEmail(newEmail, id);
  }
}