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
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from 'service/mail';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

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
    }),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          secure: configService.get<boolean>('MAIL_SECURE'),
          port: configService.get<number>('MAIL_PORT'),
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          }
        },
        defaults: {
          from: "'No Reply' <noreply@example.com>",
        },
        template: {
          dir: join(__dirname, 'main/mail'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true
          }
        }
      }),
      inject: [ConfigService]
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
    Auth,
    MailService
  ]
})
export class AppModule {}