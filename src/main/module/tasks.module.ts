import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TodoEntity } from "entity/todo.entity";
import { TasksService } from "service/tasks.service";
import { Auth } from "guard/auth.guard";

@Module({
  controllers: [TasksModule],
  providers: [TasksService, Auth],
  imports: [TypeOrmModule.forFeature([TodoEntity])]
})
export class TasksModule {}