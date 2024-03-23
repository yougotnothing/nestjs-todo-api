import { Body, Controller, Header, HttpException, Post, Res } from "@nestjs/common";
import { AuthService } from "../service/auth.service";
import { RegisterDto } from "../types/register.dto";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.registration(registerDto);
  }

  @Post('/login')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Headers', 'Content-Type')
  async login(@Body() loginDto: { name: string, password: string }) {
    try {
      const resp = await this.authService.login(loginDto);
      return resp;
    }catch(error: any) {
      throw new HttpException(error.message, error.status);
    }
  }
}
