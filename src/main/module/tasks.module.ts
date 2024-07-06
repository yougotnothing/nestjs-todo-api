import { Module } from "@nestjs/common";
import { TasksService } from "service/tasks";
import { TasksController } from "controller/tasks";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TodoEntity } from "entity/todo";
import { AuthModule } from "./auth.module";
import { UserModule } from "./user.module";

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService, TypeOrmModule.forFeature([TodoEntity])],
  imports: [TypeOrmModule.forFeature([TodoEntity]), AuthModule, UserModule]
})
export class TasksModule {}