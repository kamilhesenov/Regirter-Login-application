import { Request, Response, NextFunction } from "express";

export interface IMiddleware {
    execute: (request: Request, response: Response, next: NextFunction) => void;
}
