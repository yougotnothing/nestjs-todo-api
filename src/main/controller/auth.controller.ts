import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Query, Render, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "service/auth";
import { RegisterDto } from "types/register";
import { Response } from "express";
import { Cookie } from "decorator/cookie";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('/register')
  @HttpCode(200)
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.registration(registerDto);
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() loginDto: { login: string, password: string }, @Res({ passthrough: true }) res: Response) {
    return await this.authService.login(loginDto, res);
  }

  @Get('/refresh')
  @HttpCode(200)
  async refresh(@Cookie('refresh_token') refreshToken: string, @Res({ passthrough: true }) res: Response) {
    if(!refreshToken) throw new HttpException("refresh token is empty.", HttpStatus.BAD_REQUEST);

    return await this.authService.refresh(refreshToken, res);
  }
}