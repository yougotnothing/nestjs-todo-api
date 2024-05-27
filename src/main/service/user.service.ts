import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "entity/user.entity";
import { TodoEntity } from "entity/todo.entity";
import { PublicUserDto } from "types/public.user.dto";
import { CreateTodoDto } from "types/create.todo.dto";
import { Auth } from "guard/auth.guard";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly auth: Auth
  ) {}

  async changeAvatar(avatar: Buffer, name: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ name });

    if(!user) throw new HttpException("User not found", HttpStatus.NOT_FOUND);

    console.log("User found:", user);

    user.changeAvatar(avatar);

    console.log("User before save:", user);

    await this.userRepository.save(user);

    const updatedUser = await this.userRepository.findOneBy({ name });
    console.log("User after save:", updatedUser);

    return {
      message: "Avatar changed."
    };
  }



  async changeName(id: number, name: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ id });
    user.name = name;
    await this.userRepository.save(user);

    return {
      message: "name changed."
    }
  }

  async getTasks(username: string): Promise<{ message: string, tasks: TodoEntity[] }> {
    const tasks = await this.todoRepository.findBy({ creator: username });

    console.log('tasks: ', tasks);

    if(!tasks.length) {
      return {
        message: "user has no tasks.",
        tasks: []
      }
    }

    return {
      message: "user tasks.",
      tasks: tasks
    }
  }

  async addTask(task: CreateTodoDto, username: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ name: username });
    const newTask = new TodoEntity();

    if(!task.header.length) throw new HttpException("header cannot be empty.", HttpStatus.BAD_REQUEST);
    
    newTask.header = task.header;
    newTask.creator = username;
    newTask.user = user;
    newTask.isChecked = task.isChecked;
    newTask.important = task.important;
    newTask.createdAt = task.createdAt;
    newTask.till = task.till;
    newTask.from = task.from;
    newTask.type = task.type;
    newTask.tasks = task.tasks;
    
    await this.todoRepository.save(newTask);
    
    return {
      message: "task added."
    }
  }

  async deleteTask(id: number, taskId: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ id });
    const task = await this.todoRepository.findOneBy({ id: taskId });

    if(!user.tasks.includes(task)) return { message: "task not found." }

    await this.todoRepository.delete(task);
    await this.todoRepository.save(task);
    await this.userRepository.save(user);

    return {
      message: "task deleted."
    }
  }

  async getUser(id: number): Promise<{ message: string, user: PublicUserDto }> {
    const user = await this.userRepository.findOneBy({ id });
    
    if(!user) throw new HttpException("user not found.", HttpStatus.NOT_FOUND);

    return {
      message: "user found.",
      user: {
        isHaveAvatar: user.isHaveAvatar,
        name: user.name,
        email: user.email,
        avatar: `${process.env.API_URL}/user/get-avatar?id=${user.id}`
      }
    }
  }

  async getAvatar(id: number): Promise<Buffer> {
    return await this.userRepository.findOneBy({ id }).then(user => user.avatar);
  }
}