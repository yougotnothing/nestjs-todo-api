import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "controller/user";
import { TodoEntity } from "entity/todo";
import { UserEntity } from "entity/user";
import { UserService } from "service/user";
import { AuthModule } from "./auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TodoEntity]), AuthModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule.forFeature([UserEntity, TodoEntity])]
})
export class UserModule {}