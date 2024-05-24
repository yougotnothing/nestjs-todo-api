import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const ormconfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: "postgres",
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  synchronize: true,
  logging: true,
  entities: ["dist/**/*.entity{.ts,.js}"],
  migrations: ["dist/migrations/*{.ts,.js}"],
});