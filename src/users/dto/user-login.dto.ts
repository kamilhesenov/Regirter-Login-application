import { IsString, IsEmail } from "class-validator";

export class UserLoginDto {
    @IsEmail({},{message: "Не правильно указан email"})
    email: string;

    @IsString({message: "Не указан пароль"})
    password: string;
}
