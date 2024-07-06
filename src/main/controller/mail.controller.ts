import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { Auth } from "guard/auth";
import { MailService } from "service/mail";

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('/verify-email')
  @UseGuards(Auth)
  async verifyEmail(@Query('token') token: string) {
    return await this.mailService.verifyEmail(token);
  }
}