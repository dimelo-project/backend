import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUserProfile {
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  nickname: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsString()
  @IsNotEmpty()
  job: string;

  @IsNotEmpty()
  @IsString()
  career: string;
}
