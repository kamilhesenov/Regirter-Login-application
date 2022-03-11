import { BaseController } from '../common/base.controller';
import { ILogger } from '../logger/logger.interface';
import { IUsersController } from './users.controller.interface';
import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/http-error.class';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import 'reflect-metadata';
import { UserRegisterDto } from "./dto/user-register.dto";
import { UserLoginDto } from "./dto/user-login.dto";
import { IUsersService } from "./users.service.interface";
import { ValidateMiddleware } from "../common/validate.middleware";
import { sign } from "jsonwebtoken";
import {IConfigService} from "../config/config.service.interface";
import {AuthGuard} from "../common/auth.guard";

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor
	(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IUsersService) private usersService: IUsersService,
		@inject(TYPES.IConfigService) private configService: IConfigService,
	) {
		super(loggerService);

		this.bindRoutes([
			{ path: '/login', method: 'post', func: this.login, middlewares: [new ValidateMiddleware(UserLoginDto)] },
			{ path: '/register', method: 'post', func: this.register, middlewares: [new ValidateMiddleware(UserRegisterDto)] },
			{path: "/info", method: "get", func: this.info, middlewares: [new AuthGuard()]},
		]);
	}

    async login({body}: Request<{},{}, UserLoginDto>, response: Response, next: NextFunction): Promise<void> {
		const result = await this.usersService.validateUser(body);
		if(!result){
			return next(new HttpError(401, 'ошибка авторизация', 'login'));
		}
		const jwt = await this.signJWT(body.email, this.configService.get("SECRET"));
		this.ok(response, { jwt });
	}

    async register({body}: Request<{},{}, UserRegisterDto>, response: Response, next: NextFunction): Promise<void> {
		const result = await this.usersService.createUser(body);
		if(!result){
			return next(new HttpError(401, "Такой пользователь существует", "register"));
		}
		this.ok(response, {id: result.id, name: result.name, email: result.email});
	}

	async info({user}: Request, response: Response, next: NextFunction): Promise<void> {
		const userInfo = await this.usersService.getUserInfo(user);
		this.ok(response, {id: userInfo?.id, name: userInfo?.name, email: userInfo?.email});
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject)=>{
			sign({
				email,
				iat: Math.floor(Date.now() / 1000)
			},secret, {
				algorithm: "HS256"
			}, (error, token)=>{
				if (error) {
					reject(error);
				}
				resolve(token as string);
			})
		})
	}
}
