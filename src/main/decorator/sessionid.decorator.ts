import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UUID } from "crypto";
import { Request } from "express";

export const SessionID = createParamDecorator((data: string, ctx: ExecutionContext): UUID | null => {
	const request = ctx.switchToHttp().getRequest<Request>();
	return data ? request.session.id as UUID : null;
});