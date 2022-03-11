import { IMiddleware } from "./middleware.interface";
import { Request, Response, NextFunction } from "express";

export class AuthGuard implements IMiddleware {
    execute(request: Request, response: Response, next: NextFunction): void {
        if(request.user){
            return next();
        }
        response.status(401).send({error: "Вы не авторизованы"});
    }
}
