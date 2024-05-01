import { Module } from '@nestjs/common';
import { ormconfig } from 'dbconfig';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from 'controller/auth.controller';
import { TasksController } from 'controller/tasks.controller';
import { UserController } from 'controller/user.controller';
import { TodoEntity } from 'entity/todo.entity';
import { UserEntity } from 'entity/user.entity';
import { AuthService } from 'service/auth.service';
import { TasksService } from 'service/tasks.service';
import { UserService } from 'service/user.service';
import { Auth } from 'guard/auth.guard';


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
