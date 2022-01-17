import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class GoogleLoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  imageUrl: string;

  @IsNotEmpty()
  googleId: number;
}
