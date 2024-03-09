import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entity/user.entity";
import { Repository } from "typeorm";
import { TodoEntity } from "../entity/todo.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async changeAvatar(id: number, avatar: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ id });
    user.avatar = avatar;
    if(!user.isHaveAvatar) user.isHaveAvatar = true;

    await this.userRepository.save(user);

    return {
      message: "avatar changed."
    }
  }

  async changeName(id: number, name: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ id });
    user.name = name;
    await this.userRepository.save(user);

    return {
      message: "name changed."
    }
  }

  async getTasks(id: number): Promise<{ message: string, tasks: TodoEntity[] }> {
    const user = await this.userRepository.findOneBy({ id });
    const tasks = await this.todoRepository.findBy({ user: user });

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

  async addTask(task: TodoEntity): Promise<{ message: string }> {
    const task_ = new TodoEntity();
    task.content = task.content;
    task.header = task.header;

    await this.todoRepository.save(task_);

    return {
      message: "task added."
    }
  }

  async deleteTask(id: number, taskId: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ id });
    const task = await this.todoRepository.findOneBy({ id: taskId });

    if(!user.tasks.includes(task)) {
      return {
        message: "task not found."
      }
    }

    await this.todoRepository.delete(task);
    await this.todoRepository.save(task);
    await this.userRepository.save(user);

    return {
      message: "task deleted."
    }
  }
}