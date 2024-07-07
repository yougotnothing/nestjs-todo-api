import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { UserEntity } from "entity/user";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";

@Injectable()
export class Auth implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if(!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.configService.get<string>('JWT_SECRET')
        }
      );

      request['user'] = payload;
    }catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractToken(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}