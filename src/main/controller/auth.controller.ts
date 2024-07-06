import { Body, Controller, Get, HttpCode, Post, Query, Render, Req, Res, UseGuards } from "@nestjs/common";
import { Auth } from "guard/auth";
import { AuthService } from "service/auth";
import { MailService } from "service/mail";
import { RegisterDto } from "types/register";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService
  ) {}

  @Post('/register')
  @HttpCode(200)
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.registration(registerDto);
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() loginDto: { login: string, password: string }) {
    return await this.authService.login(loginDto);
  }
}