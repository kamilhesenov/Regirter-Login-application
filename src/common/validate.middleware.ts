import { IMiddleware } from "./middleware.interface";
import { ClassConstructor, plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

export class ValidateMiddleware implements IMiddleware {

    constructor(private classToValidate: ClassConstructor<object>) {}

    execute({body}: Request, response: Response, next: NextFunction): void {
        const instance = plainToClass(this.classToValidate, body);
        validate(instance).then((errors)=>{
            if(errors.length > 0){
                response.status(422).send(errors);
            }
            else {
                next();
            }
        })
    }
}
