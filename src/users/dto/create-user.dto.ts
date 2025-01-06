import { IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
    public id: number;
    @IsString()
    public username: string;
    @IsString()
    @IsStrongPassword()
    public password: string;

}
