import { Module } from '@nestjs/common';
import { ormconfig } from 'dbconfig';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from 'controller/tasks';
import { UserController } from 'controller/user';
import { TodoEntity } from 'entity/todo';
import { UserEntity } from 'entity/user';
import { TasksService } from 'service/tasks';
import { UserService } from 'service/user';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from 'module/auth';
import { MailModule } from 'module/mail';
import { UserModule } from 'module/user';
import { TasksModule } from 'module/tasks';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ormconfig(configService),
      inject: [ConfigService],
    }),
    MulterModule.register({ dest: './uploads/' }),
    AuthModule,
    MailModule,
    UserModule,
    TasksModule,
    TypeOrmModule.forFeature([UserEntity, TodoEntity]),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      expandVariables: true
    }),
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ]
})
export class AppModule {}