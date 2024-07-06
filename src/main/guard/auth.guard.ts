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

  async validate(token: string): Promise<{ isValid: boolean, name?: string }> {
    const encryptedToken = Buffer.from(token, 'base64').toString('utf-8').split(':');
    const user = await this.userRepository.findOneBy({ name: encryptedToken[0] });
    const isTokenValid = await user.comparePassword(encryptedToken[1]);

    if(!isTokenValid) {
      return { isValid: false };
    }else return { isValid: true, name: encryptedToken[0] };
  }
}