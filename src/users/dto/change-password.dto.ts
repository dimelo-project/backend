import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePassword {
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  checkPassword: string;
}
