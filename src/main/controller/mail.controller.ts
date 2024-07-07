import { Controller, Get, Headers, HttpCode, Post, Query, Render, Req, Res, UseGuards } from "@nestjs/common";
import { Auth } from "guard/auth";
import { MailService } from "service/mail";

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('/verify-email')
  @HttpCode(200)
  @Render('verify-email-message')
  async verifyEmail(@Query('token') token: string) {
    return await this.mailService.verifyEmail(token);
  }

  @Post('/send-verify-email-message')
  @UseGuards(Auth)
  @HttpCode(200)
  async sendVerifyEmailMessage(@Query('token') token: string) {
    return await this.mailService.sendVerifyEmailMessage(token);
  }
}