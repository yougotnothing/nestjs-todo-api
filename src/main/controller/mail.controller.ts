import { Controller, Get, HttpCode, Post, Query, Render, Req, UseGuards } from "@nestjs/common";
import { UUID } from "crypto";
import { AuthGuard } from "guard/auth";
import { MailService } from "service/mail";
import { Request } from "express";

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('/verify-email')
  @HttpCode(200)
  @Render('verify-email-message')
  async verifyEmail(@Query('sid') sid: string) {
    return await this.mailService.verifyEmail(sid);
  }

  @Post('/send-verify-email-message')
  @HttpCode(200)
  async sendVerifyEmailMessage(@Query('id') id: UUID) {
    return await this.mailService.sendVerifyEmailMessage(id);
  }

  @Post('/send-restore-password-email-message')
  @HttpCode(200)
  async sendRestorePasswordEmailMessage(@Query('id') id: UUID) {
    return await this.mailService.sendRestorePasswordEmailMessage(id);
  }
}