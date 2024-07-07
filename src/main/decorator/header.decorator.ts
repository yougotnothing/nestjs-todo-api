import { createParamDecorator } from "@nestjs/common";
import { Request } from "express";

export const Header = createParamDecorator((data: string, req: Request) => req.headers[data]);