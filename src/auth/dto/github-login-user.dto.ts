import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class GithubLoginUserDto {
  @IsOptional()
  @IsEmail()
  email: string | null;

  @IsOptional()
  imageUrl: string;

  @IsNotEmpty()
  githubId: number;
}
