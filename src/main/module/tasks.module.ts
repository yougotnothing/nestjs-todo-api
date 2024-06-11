import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TodoEntity } from "entity/todo";
import { TasksService } from "service/tasks";
import { Auth } from "guard/auth";

@Module({
  controllers: [TasksModule],
  providers: [TasksService, Auth],
  imports: [TypeOrmModule.forFeature([TodoEntity])]
})
export class TasksModule {}