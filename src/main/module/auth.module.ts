import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "controller/auth"; 
import { UserEntity } from "entity/user";
import { AuthService } from "service/auth";
import { AuthGuard } from "guard/auth";
import { MailService } from "service/mail";
import { AuthStrategy } from "strategy/auth";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRES-IN')
        }
      }),
      inject: [ConfigService]
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, MailService, AuthStrategy],
  exports: [AuthService, AuthGuard, MailService, JwtModule],
})
export class AuthModule {}