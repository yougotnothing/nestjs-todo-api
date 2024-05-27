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

  async getTasksBySubstring(substring: string): Promise<{ message: string, tasks: TodoEntity[] }> {
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

    async getTasksByWeek(week: string): Promise<{ message: string, tasks: TodoEntity[] }> {
    // Преобразуем строку в объект Date
    const parseDate = (dateString: string): Date => {
      const [month, day, year] = dateString.split(" ");
      return new Date(`${month} ${parseInt(day)}, ${year}`);
    };

    const parsedDate = parseDate(week);
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date format");
    }

    // Начало и конец недели
    const startDate = new Date(parsedDate);
    const endDate = new Date(parsedDate);
    endDate.setDate(startDate.getDate() + 6);

    // Получение задач за неделю
    const tasks = await this.todoRepository.find({
      where: {
        createdAtDate: Between(startDate, endDate)
      }
    });

    return {
      message: "Tasks for the week retrieved successfully.",
      tasks: tasks
    };
  }

  async getTasksLength(): Promise<{ message: string, tasks: Record<TodoType, number> }> {
    const tasks = await this.todoRepository.find();

    const tasksLength = tasks.reduce((acc, task) => {
      switch(task.type) {
        case "school": acc.school += 1; break;
        case "work": acc.work += 1; break;
        case "shop": acc.shop += 1; break;
        case "read": acc.read += 1; break;
        case "work out": acc["work out"] += 1; break;
      }
      return acc;
    }, { "school": 0, "work": 0, "shop": 0, "read": 0,"work out": 0 });

    return {
      message: "tasks length retrieved successfully.",
      tasks: tasksLength
    };
  }
}