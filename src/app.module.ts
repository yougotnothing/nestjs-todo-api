import { Module } from '@nestjs/common';
import { ormconfig } from 'dbconfig';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from 'controller/auth';
import { TasksController } from 'controller/tasks';
import { UserController } from 'controller/user';
import { TodoEntity } from 'entity/todo';
import { UserEntity } from 'entity/user';
import { AuthService } from 'service/auth';
import { TasksService } from 'service/tasks';
import { UserService } from 'service/user';
import { Auth } from 'guard/auth';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    UserEntity,
    TodoEntity,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ormconfig(configService),
      inject: [ConfigService],
    }),
    MulterModule.register({
      dest: './uploads/'
    }),
    TypeOrmModule.forFeature([UserEntity, TodoEntity]),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      expandVariables: true
    })
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