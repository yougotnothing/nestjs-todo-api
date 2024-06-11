import { Body, Controller, Header, HttpCode, HttpException, Post } from "@nestjs/common";
import { AuthService } from "service/auth";
import { RegisterDto } from "types/register";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
