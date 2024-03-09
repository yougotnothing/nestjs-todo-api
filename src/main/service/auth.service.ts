import { HttpCode, HttpException, HttpStatus, Injectable, Response } from "@nestjs/common";
import { UserEntity } from "../entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { RegisterDto } from "../types/register.dto";
import { response } from "express";

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async registration(user_dto: RegisterDto): Promise<{ status: number, message: string }> {
    const isUserCreated = await this.userRepository.findOneBy({ name: user_dto.name, email: user_dto.email });
    const user = new UserEntity();

    if(isUserCreated) {
      throw new HttpException("User already exists.", HttpStatus.BAD_REQUEST);
    }else{
      if(user_dto.password !== user_dto.confirmPassword) {
        throw new HttpException("Passwords don't match.", HttpStatus.BAD_REQUEST);
      }
      
      user.name = user_dto.name;
      user.email = user_dto.email;
      user.password = await bcrypt.hash(user_dto.password, 10);
      user.tasks = [];
      
      this.userRepository.save(user);
      
      HttpStatus.OK;
      return {
        status: 201,
        message: 'you have been registered!'
      }
    }
  }

  async login(loginDto: { name: string, password: string }): Promise<{ message: string, token: string }> {
    const { name, password } = loginDto;
    const user = await this.userRepository.findOneBy({ name });

    if(!user) {
      throw new HttpException("User not found.", HttpStatus.NOT_FOUND);
    }

    const isMatching: boolean = await user.comparePassword(password);

    if(!isMatching) {
      throw new HttpException("Passwords don't match.", HttpStatus.BAD_REQUEST);
    }

    const TOKEN = Buffer.from(`${user.name}:${password}`).toString('base64');

    return {
      message: "you have been loggined in!",
      token: TOKEN 
    }
  }
}