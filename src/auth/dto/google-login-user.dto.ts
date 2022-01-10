import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleLoginUserDto {
  @IsNotEmpty()
  email: string;

  @IsString()
  imageUrl: string;

  @IsNotEmpty()
  googleId: number;
}
