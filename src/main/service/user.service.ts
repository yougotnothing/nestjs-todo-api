import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "entity/user";
import { TodoEntity } from "entity/todo";
import { PublicUserDto } from "types/public-user";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UUID } from "crypto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService
  ) {}

  async changeAvatar(avatar: Buffer, name: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ name });

    if(!user) throw new HttpException("User not found", HttpStatus.NOT_FOUND);

    user.changeAvatar(avatar);

    await this.userRepository.save(user);

    return {
      message: "Avatar changed."
    };
  }

  async changeName(newName: string, id: UUID): Promise<{ message: string, token: string }> {
    const user = await this.userRepository.findOneBy({ id });

    if(!user) throw new HttpException("user not found.", HttpStatus.NOT_FOUND);
    if(newName === user.name) throw new HttpException("Name can't be same.", 440);
    if(newName.length < 3) throw new HttpException("Name must be less than 3 characters.", 441);
    if(newName.length > 20) throw new HttpException("Name must be less than 20 characters.", 442);
    if(newName === "admin") throw new HttpException("Name can't be admin.", 443);

    user.name = newName;

    await this.userRepository.save(user);

    return {
      message: `name changed to ${user.name}`,
      token: this.jwtService.sign({ name: user.name, sub: user.id })
    }
  }

  async getTasks(creator: UUID): Promise<{ message: string, tasks: TodoEntity[] }> {
    const tasks = await this.todoRepository.findBy({ creator });

    if(!tasks.length) return {
      message: "user has no tasks.",
      tasks: []
    }

    return {
      message: "user tasks.",
      tasks: tasks
    }
  }

  async getUser(id: UUID): Promise<{ message: string, user: PublicUserDto }> {
    const user = await this.userRepository.findOneBy({ id });
    
    if(!user) throw new HttpException("user not found.", HttpStatus.NOT_FOUND);

    return {
      message: "user found.",
      user: {
        isHaveAvatar: user.isHaveAvatar,
        name: user.name,
        email: user.email,
        avatar: `${process.env.API_URL}/user/get-avatar?id=${user.id}`,
        id: user.id
      }
    }
  }

  async changePassword(password: string, name: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ name });

    if(!user) throw new HttpException("user not found.", HttpStatus.NOT_FOUND);
    if(password.length > 8) throw new HttpException("Password must be less than 8 characters.", 440);
    if(!await bcrypt.compare(password, user.password)) throw new HttpException("Passwords don't match.", 443);

    await this.userRepository.update(user.id, { password: await bcrypt.hash(password, 10) });

    return {
      message: "password changed.",
    }
  }

  async getAvatar(id: UUID, time: Date): Promise<Buffer> {
    const user = await this.userRepository.findOneBy({ id });

    console.log('time: ', time);

    return user.avatar;
  }
}