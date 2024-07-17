import { Injectable, CanActivate, ExecutionContext, HttpException } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const sid = this.extractSID(request);

    if(sid !== request.session.id) throw new HttpException(`${request.sessionID} is not equal to ${sid}`, 401);

    return true;
  }

  private extractSID(request: Request): string | undefined {
    const [type, sid] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'SID' ? sid : undefined;
  }
}