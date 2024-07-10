import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MailController } from "controller/mail";
import { UserEntity } from "entity/user";
import { join } from "path";
import { AuthService } from "service/auth";
import { MailService } from "service/mail";
import { AuthModule } from "./auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
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
          from: "'Mtodo' <mtodo.verify@gmail.com>",
        },
        template: {
          dir: join(__dirname, '..','templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true
          }
        }
      }),
      inject: [ConfigService]
    }),
    AuthModule
  ],
  controllers: [MailController],
  providers: [MailService, AuthService, MailerModule],
})
export class MailModule {}