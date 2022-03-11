import { IsString, IsEmail } from "class-validator";

export class UserRegisterDto {
    @IsString({message: "Не указан имя"})
    name: string;

    @IsEmail({},{message: "Не правильно указан email"})
    email: string;

    @IsString({message: "Не указан пароль"})
    password: string;
}
