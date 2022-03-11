import { Request, Response, NextFunction, Router } from 'express';
import { IMiddleware } from "./middleware.interface";

export interface IRoute {
	path: string;
	func: (request: Request, response: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'put' | 'patch' | 'delete'>;
	middlewares?: IMiddleware[];
}

export type ExpressReturnType = Response<any, Record<string, any>>;
