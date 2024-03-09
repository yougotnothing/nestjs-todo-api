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

@Module({
  imports: [
    UserEntity,
    TodoEntity,
    TypeOrmModule.forRoot(ormconfig),
    TypeOrmModule.forFeature([UserEntity, TodoEntity]),
  ],
  controllers: [AppController, AuthController, UserController],
  providers: [
    AuthService,
    AppService,
    UserService,
  ]
})
export class AppModule {}
