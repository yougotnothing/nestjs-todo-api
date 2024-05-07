import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Like, Repository } from "typeorm";
import { TodoEntity } from "entity/todo.entity";
import { TodoType } from "types/todo.type";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>
  ) {}

  async createTask(task: TodoEntity): Promise<{ message: string }> {
    const task_ = new TodoEntity();
    task_.header = task.header;
    task_.isChecked = false;

    await this.todoRepository.save(task_);

    return {
      message: "task added."
    }
  }

  async deleteTask(id: number): Promise<{ message: string }> {
    const task = await this.todoRepository.findOneBy({ id });

    if(!task) return { message: "task not found." }

    await this.todoRepository.delete(task);

    return {
      message: "task deleted."
    }
  }

  async changeHeader(body: { id: number, header: string }): Promise<{ message: string }> {
    const task = await this.todoRepository.findOneBy({ id: body.id });

    if(!task) return { message: "task not found." }
    if(body.header === task.header) return { message: "header is same." }
    if(body.header.length < 1) return { message: "header is empty." }

    task.header = body.header;
    await this.todoRepository.save(task);

    return {
      message: "header changed."
    }
  }

  async searchTasks(substring: string): Promise<{ message: string, tasks: TodoEntity[] }> {
    const tasks = await this.todoRepository.find({ where: { header: Like(`%${substring}%`) } });

    if(!tasks.length) return {
      message: "user has no tasks.",
      tasks: []
    }

    return {
      message: `tasks by substring ${substring}:`,
      tasks: tasks
    }
  }

  async getTasksByType(type: TodoType): Promise<{ message: string, tasks: TodoEntity[] }> {
    const tasks = await this.todoRepository.find({ where: { type } });

    if(!tasks.length) return {
      message: `user has no tasks of type ${type}.`,
      tasks: []
    }

    return {
      message: `tasks by type ${type}:`,
      tasks: tasks
    }
  }

  async getTodayTasks(createdAt: string): Promise<{ message: string, tasks: TodoEntity[] }> {
    const tasks = await this.todoRepository.findBy({ createdAt }); 

    if(!tasks.length) return {
      message: "user has no tasks.",
      tasks: []
    }

    return {
      message: `tasks by created at ${createdAt}:`,
      tasks: tasks
    }
  }

  async getTasksByHeader(header: string): Promise<{ message: string, tasks: TodoEntity[] }> {
    const tasks = await this.todoRepository.findBy({ header });

    if(!tasks.length) return {
      message: "user has no tasks.",
      tasks: []
    }

    return {
      message: `tasks with header ${header}:`,
      tasks: tasks
    }
  }

  async getTasksByMonth(month: string): Promise<{ message: string, tasks: TodoEntity[] }> {
    const tasks = await this.todoRepository.findBy({ createdAt: Like(`%${month}%`) });

    if(!tasks.length) return {
      message: `you have no tasks in ${month}.`,
      tasks: []
    }

    return {
      message: `tasks in ${month}:`,
      tasks: tasks
    }
  }

  async getTasksByWeek(date: string): Promise<{ message: string, tasks: TodoEntity[] }> {
    const splittedDate = date.split(", ");

    const getDate = (day: number): string => {
      const updatedDate = splittedDate[1].split("");
      updatedDate.pop();
      updatedDate.push(day.toString());
      const dateString = updatedDate.join("");
  
      return `${splittedDate[0]}, ${dateString}, ${splittedDate[2]}`;
    };

    const tasks = await this.todoRepository.findBy({
      createdAt: Between(
        getDate(parseInt(splittedDate[1][splittedDate[1].length - 1])),
        getDate(parseInt(splittedDate[1][splittedDate[1].length - 1]) + 7)
      )
    });

    return {
      message: "Tasks for the week retrieved successfully.",
      tasks: tasks
    };
  }
}