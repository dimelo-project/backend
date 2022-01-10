import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleCreateUserDto {
  @IsNotEmpty()
  email: string;

  @IsString()
  imageUrl: string;

  @IsNotEmpty()
  googleId: string;
}
