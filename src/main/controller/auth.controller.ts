import { Body, Controller, HttpCode, Patch, Post, Res } from "@nestjs/common"; 
import { AuthService } from "service/auth";
import { RegisterDto } from "types/register";
import { LoginDto } from "types/login";
import { Response } from "express";

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
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.login(loginDto, res);
  }

  @Patch('/refresh')
  @HttpCode(200)
  async refresh(@Res({ passthrough: true }) res: Response) {
    return await this.authService.refresh(res);
  }
}