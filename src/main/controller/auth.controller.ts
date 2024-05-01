import { Body, Controller, Header, HttpCode, HttpException, Post } from "@nestjs/common";
import { AuthService } from "service/auth.service";
import { RegisterDto } from "types/register.dto";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('/register')
  @HttpCode(200)
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.registration(registerDto);
  }

  @Post('/login')
  @HttpCode(200)
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Headers', 'Content-Type')
  async login(@Body() loginDto: { login: string, password: string }) {
    try {
      return await this.authService.login(loginDto);
    }catch(error: any) {
      throw new HttpException(error.message, error.status);
    }
  }
}
