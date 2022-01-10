import { IsNotEmpty, IsString } from 'class-validator';

export class GithubLoginUserDto {
  @IsNotEmpty()
  email: string;

  @IsString()
  imageUrl: string;

  @IsNotEmpty()
  githubId: number;
}
