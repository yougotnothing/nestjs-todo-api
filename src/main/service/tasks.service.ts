import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TodoEntity } from "../entity/todo.entity";
import { Like, Repository } from "typeorm";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>
  ) {}

  async createTask(task: TodoEntity): Promise<{ message: string }> {
    const task_ = new TodoEntity();
    task_.content = task.content;
    task_.header = task.header;
    task_.isChecked = false;

    await this.todoRepository.save(task_);

    return {
      message: "task added."
    }
  }

  async deleteTask(id: number): Promise<{ message: string }> {
    const task = await this.todoRepository.findOneBy({ id });

    if(!task) {
      return {
        message: "task not found."
      }
    }

    await this.todoRepository.delete(task);

    return {
      message: "task deleted."
    }
  }

  async changeHeader(body: { id: number, header: string }): Promise<{ message: string }> {
    const task = await this.todoRepository.findOneBy({ id: body.id });

    if(!task) {
      return {
        message: "task not found."
      }
    }

    if(body.header === task.header) {
      return {
        message: "header is same."
      }
    }

    if(body.header.length < 1) {
      return {
        message: "header is empty."
      }
    }

    task.header = body.header;
    await this.todoRepository.save(task);

    return {
      message: "header changed."
    }
  }

  async changeContent(body: { id: number, content: string }): Promise<{ message: string }> {
    const task = await this.todoRepository.findOneBy({ id: body.id });

    if(!task) {
      return {
        message: "task not found."
      }
    }

    if(body.content === task.content) {
      return {
        message: "header is same."
      }
    }

    if(body.content.length < 1) {
      return {
        message: "header is empty."
      }
    }
    
    task.content = body.content;
    await this.todoRepository.save(task);

    return {
      message: "content changed."
    }
  }

  async searchTasks(substring: string): Promise<{ message: string, tasks: TodoEntity[] }> {
    const tasks = await this.todoRepository.find({ where: { content: Like(`%${substring}%`) } });

    if(!tasks.length) {
      return {
        message: "user has no tasks.",
        tasks: []
      }
    }

    return {
      message: `tasks by substring ${substring}:`,
      tasks: tasks
    }
  }
}