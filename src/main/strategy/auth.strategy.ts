import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UserEntity } from "entity/user";
import { AuthService } from "service/auth";
import { LoginDto } from "types/login";
import { Response } from "express";

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super();
	}

	async validateUser({ login, password }: LoginDto): Promise<UserEntity> {
		const user = await this.authService.validateUser({ login, password });

		if(!user) throw new HttpException("User not found.", HttpStatus.NOT_FOUND);
		if(password.length < 8) throw new HttpException("Password must be less than 8 characters.", 440);

		return user;
	}

	async validateToken(loginDto: LoginDto, res: Response): Promise<UserEntity> {
		const user = await this.validateUser(loginDto);

		if(res.req.session['user_id'] !== user.id) throw new HttpException("Session invalid.", 401);

		return user;
	}
}