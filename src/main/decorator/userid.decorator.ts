import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const UserID = createParamDecorator((data: string, ctx: ExecutionContext): string | null => {
  const request = ctx.switchToHttp().getRequest<Request>();
  return data ? request.session['user_id'] : null;
});