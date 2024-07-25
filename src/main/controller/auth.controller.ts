import { Body, Controller, Get, HttpCode, Patch, Post, Render, Res, UseGuards } from "@nestjs/common"; 
import { AuthService } from "service/auth";
import { RegisterDto } from "types/register";
import { LoginDto } from "types/login";
import { Response } from "express";
import { UUID } from "crypto";
import { ChangePasswordDto } from "types/change-password";
import { SessionID } from "decorator/sessionid";
import { AuthGuard } from "guard/auth";

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

  @Get('/restore-password-message')
  @HttpCode(200)
  @Render('restore-password-message')
  async restorePasswordMessage(@Res({ passthrough: true }) res: Response) {
    return {
      message: "page rendered."
    }
  }

  @Post('/restore-password')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async restorePassword(
    @Body() body: ChangePasswordDto,
    @SessionID() id: UUID
  ) {
    return await this.authService.restorePassword(body, id);
  }
}