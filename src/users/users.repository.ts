import { IUsersRepository } from "./users.repository.interface";
import { UserModel } from "@prisma/client";
import { User } from "./user.entity";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { PrismaService } from "../database/prisma.service";

@injectable()
export class UsersRepository implements IUsersRepository {
    constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

   async create({name, email, password}: User): Promise<UserModel> {
      return this.prismaService.client.userModel.create({
            data: {
                name,
                email,
                password
            }
        });
    }

    async find(email: string): Promise<UserModel | null> {
        return this.prismaService.client.userModel.findFirst({
            where: {
                email
            }
        })
    }

}
