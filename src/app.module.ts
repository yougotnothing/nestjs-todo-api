import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './main/service/auth.service';
import { UserEntity } from './main/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './main/entity/todo.entity';
import { AuthController } from './main/controller/auth.controller';
import { ormconfig } from 'dbconfig';
import { UserService } from './main/service/user.service';
import { UserController } from './main/controller/user.controller';
import { TasksService } from './main/service/tasks.service';
import { TasksController } from './main/controller/tasks.controller';
import { Auth } from './main/guard/auth.guard';

@Module({
  imports: [
    UserEntity,
    TodoEntity,
    TypeOrmModule.forRoot(ormconfig),
    TypeOrmModule.forFeature([UserEntity, TodoEntity]),
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    TasksController
  ],
  providers: [
    AuthService,
    AppService,
    UserService,
    TasksService,
    Auth
  ]
})
export class AppModule {}
