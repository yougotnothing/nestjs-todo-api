import { Controller, Get, HttpCode, Post, Query, Render, UseGuards } from "@nestjs/common";
import { UUID } from "crypto";
import { AuthGuard } from "guard/auth";
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
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async sendVerifyEmailMessage(@Query('token') token: string) {
    return await this.mailService.sendVerifyEmailMessage(token);
  }

  @Post('/send-restore-password-email-message')
  @HttpCode(200)
  async sendRestorePasswordEmailMessage(@Query('id') id: UUID) {
    return await this.mailService.sendRestorePasswordEmailMessage(id);
  }
}