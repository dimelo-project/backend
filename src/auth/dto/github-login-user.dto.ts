import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class GithubLoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  imageUrl: string;

  @IsNotEmpty()
  githubId: number;
}
