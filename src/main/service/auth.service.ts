import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "entity/user";
import { RegisterDto } from "types/register";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtTokenPromise } from "types/jwt-tokens";
import { JwtTokenKeys } from "types/jwt-token-keys";
import { Response } from "express";
import { MailService } from "./mail.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async registration(user_dto: RegisterDto): Promise<{ status: number, message: string }> {
    const { email, name, password } = user_dto;
    const isUserCreated = await this.userRepository.findOneBy({ name, email });
    const user = new UserEntity();

    if(isUserCreated) {
      throw new HttpException("User already exists.", HttpStatus.BAD_REQUEST);
    }else{
      if(password.length > 8) throw new HttpException("Password must be less than 8 characters.", 440);
      if(name.length < 3) throw new HttpException("Name must be less than 3 characters.", 441);

      user.name = name;
      user.email = email;
      user.password = await bcrypt.hash(password, 10);
      user.tasks = [];
      user.avatar = Buffer.from("");
      
      await this.userRepository.save(user);

      return {
        status: 200,
        message: 'you have been registered!'
      }
    }
  }

  signToken(keys: JwtTokenKeys, type: 'access' | 'refresh'): string {
    return this.jwtService.sign(keys, {
      expiresIn:
        type === 'access' 
        ? this.configService.get<string>('JWT_ACCESS_EXPIRES-IN')
        : this.configService.get<string>('JWT_REFRESH_EXPIRES-IN'),
    });
  }

  async refresh(refreshToken: string, res: Response): Promise<JwtTokenPromise> {
    const { name, sub } = await this.jwtService.verifyAsync<JwtTokenKeys>(refreshToken);

    res.cookie(
      'refresh_token',
      this.signToken({ name, sub }, 'refresh'),
      {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
      }
    );

    return {
      message: "your tokens have been refreshed.",
      access_token: this.signToken({ name, sub }, 'access'),
    }
  }

  async login(loginDto: { login: string, password: string }, res: Response): Promise<JwtTokenPromise> {
    const regex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
    const { login, password } = loginDto;
    let user: UserEntity;

    if(regex.test(login)) {
      user = await this.userRepository.findOneBy({ email: login });
    }else{
      user = await this.userRepository.findOneBy({ name: login });
    }

    if(!user) throw new HttpException("User not found.", HttpStatus.NOT_FOUND);
    if(password.length < 8) throw new HttpException("Password must be less than 8 characters.", 440);

    const isMatching = await user.comparePassword(password);

    if(!isMatching) throw new HttpException("Passwords don't match.", HttpStatus.BAD_REQUEST);

    res.cookie(
      'refresh_token',
      this.signToken({ name: user.name, sub: user.id }, 'refresh'),
      {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
      }
    );

    return {
      message: "you have been logged in.",
      access_token: this.signToken({ name: user.name, sub: user.id }, 'access'),
    }
  }
}