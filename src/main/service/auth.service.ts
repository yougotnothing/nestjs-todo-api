import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "entity/user";
import { RegisterDto } from "types/register";
import { LoginDto } from "types/login";
import { Response } from "express";
import { UUID } from "crypto";
import { ChangePasswordDto } from "types/change-password";
import { SessionRequest } from "types/session-request";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}
  async registration(user_dto: RegisterDto): Promise<{ message: string }> {
    const { email, name, password } = user_dto;
    const isUserCreated = await this.userRepository.findOneBy({ name, email });
    const user = new UserEntity();

    if(isUserCreated) throw new HttpException("User already exists.", HttpStatus.BAD_REQUEST);
    if(password.length > 8) throw new HttpException("Password must be less than 8 characters.", 440);
    if(name.length < 3) throw new HttpException("Name must be less than 3 characters.", 441);

    user.name = name;
    user.email = email;
    user.password = await bcrypt.hash(password, 10);

    this.userRepository.save(user);

    return {
      message: 'you have been registered!'
    }
  }

  async login({ login, password }: LoginDto, res: Response): Promise<SessionRequest> {
    const user = await this.validateUser({ login, password });

    res.req.session['user_id'] = user.id;
    user.sessionID = res.req.session.id;

    res.cookie('sid', res.req.session.id, {
      httpOnly: true,
      secure: false,
      maxAge: 360000,
      path: '/',
    });

    await this.userRepository.save(user);

    return {
      message: "You have been logged in.",
      session: user.sessionID
    }
  }

  async validateUser({ login, password }: LoginDto): Promise<UserEntity> {
    const regex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
    let user: UserEntity;

    if(regex.test(login)) {
      user = await this.userRepository.findOneBy({ email: login });
    }else{
      user = await this.userRepository.findOneBy({ name: login });
    }

    if(!user) throw new HttpException("User not found.", HttpStatus.NOT_FOUND);
    if(!await bcrypt.compare(password, user.password)) throw new HttpException("Passwords don't match.", HttpStatus.BAD_REQUEST);

    return user;
  }

  async refresh(res: Response): Promise<SessionRequest> {
    const user = await this.userRepository.findOneBy({ id: res.req.session['user_id'] });

    if(!user) throw new HttpException("User not found.", HttpStatus.NOT_FOUND);

    res.req.session.regenerate((err) => {
      if(err) throw new HttpException(err, 401);
    });
    
    res.req.session['user_id'] = user.id;
    user.sessionID = res.req.session.id;
    await this.userRepository.save(user);

    return {
      message: "refresh success.",
      session: res.req.sessionID
    }
  }

  async restorePasswordMessage(id: UUID): Promise<SessionRequest> {
    const user = await this.userRepository.findOneBy({ id });

    if(!user) throw new HttpException("User not found.", HttpStatus.NOT_FOUND);
    if(!user.isVerified) throw new HttpException("User not verified.", HttpStatus.BAD_REQUEST);

    return {
      message: "restore password success.",
      session: user.sessionID
    }
  }

  async restorePassword({ password, confirmPassword }: ChangePasswordDto, id: UUID): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });

    if(!user) console.log('user not found.');
    if(password.length < 8) console.log('password must be less than 8 characters.');
    if(password !== confirmPassword) console.log('passwords don\'t match.');
    if(await bcrypt.compare(password, user.password)) console.log('password is same.');

    user.password = await bcrypt.hash(password, 10);
  }
}