import { ILogger } from '../logger/logger.interface';
import { Response, Router } from 'express';
import { ExpressReturnType, IRoute } from './route.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import 'reflect-metadata';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(response: Response, code: number, message: T): ExpressReturnType {
		response.type('application/json');
		return response.status(code).json(message);
	}

	public ok<T>(response: Response, message: T): ExpressReturnType {
		return this.send(response, 200, message);
	}

	public created(response: Response): ExpressReturnType {
		return response.sendStatus(201);
	}

	protected bindRoutes(routes: IRoute[]): void {
		for (const route of routes) {
			this.logger.log(`[${route.method}] ${route.path}`);
			const middleware = route.middlewares?.map(m => m.execute.bind(m));
			const handler = route.func.bind(this);
			const pipeline = middleware ? [...middleware, handler] : handler;
			this.router[route.method](route.path, pipeline);
		}
	}
}
