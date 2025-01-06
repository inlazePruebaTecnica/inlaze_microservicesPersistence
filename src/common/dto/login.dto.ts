import { IsString, IsStrongPassword } from "class-validator";

export class LoginDto {
  @IsString()
  public username: string;
  @IsString()
  @IsStrongPassword()
  public password: string;
}
