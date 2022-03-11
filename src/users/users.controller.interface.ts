import { Request, Response, NextFunction } from 'express';

export interface IUsersController {
	login: (request: Request, response: Response, next: NextFunction) => void;
	register: (request: Request, response: Response, next: NextFunction) => void;
}
