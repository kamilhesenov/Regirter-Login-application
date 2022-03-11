import { IMiddleware } from "./middleware.interface";
import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

export class AuthMiddleware implements IMiddleware {
    constructor(private secret: string) {}

    execute(request: Request, response: Response, next: NextFunction): void {
      if(request.headers.authorization){
          verify(request.headers.authorization.split(" ")[1], this.secret, (error,payload)=>{
              if(error){
                  next();
              }
              else if(payload){
                  // @ts-ignore
                  request.user = payload.email;
                  next();
              }
          })
      }
      else{
          next();
      }
    }

}
