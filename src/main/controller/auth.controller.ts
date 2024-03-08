import { Body, Controller, HttpException, Post, Res } from "@nestjs/common";
import { UserEntity } from "../entity/user.entity";
import { AuthService } from "../service/auth.service";
import { RegisterDto } from "../types/register.dto";
import { Response } from "express";

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
  async login(@Body() loginDto: { name: string, password: string }, @Res() response: Response) {
    try {
      const resp = await this.authService.login(loginDto);
      response.set('Authorization', `Basic ${resp.token}`).json(resp);
      return resp;
    }catch(error: any) {
      throw new HttpException(error.message, error.status);
    }
  }
}
