import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "entity/user";
import { RegisterDto } from "types/register";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
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

  async login(loginDto: { login: string, password: string }): Promise<{ message: string, token: string }> {
    const regex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
    const { login, password } = loginDto;
    let user: UserEntity;
    
    if(!regex.test(login)) {
      user = await this.userRepository.findOneBy({ name: login });
    }else{
      user = await this.userRepository.findOneBy({ email: login })
    }

    if(!user) throw new HttpException("User not found.", HttpStatus.NOT_FOUND);
    if(password.length > 8) throw new HttpException("Password must be less than 8 characters.", 440);

    const isMatching: boolean = await user.comparePassword(password);

    if(!isMatching) throw new HttpException("Passwords don't match.", HttpStatus.BAD_REQUEST);

    return {
      message: "you have been loggined in!",
      token: Buffer.from(`${user.name}:${password}`).toString('base64') 
    }
  }
}